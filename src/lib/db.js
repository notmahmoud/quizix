import { db } from './firebase';
import { ref, set, get, update, onValue } from 'firebase/database';

// ─────────────────────────────────────────────────────────────────────────────
// db.js — Database Access Layer
//
// This file is the single point of contact between the application and
// Firebase Realtime Database. Every hook (useDashboard, useHostLobby, etc.)
// calls these functions instead of talking to Firebase directly, which keeps
// database logic centralized and easy to maintain.
//
// Firebase Realtime Database stores data as a JSON tree.
// The structure used in this project looks like:
//
//   rooms/
//     {roomCode}/
//       title, status, settings, questions, students/
//         {uid}/ → name, status, answers, score, breakdown
//
//   users/
//     {uid}/
//       hostedRooms/  → summary cards shown on the host's dashboard
//       joinedRooms/  → summary cards shown on the student's dashboard
//       soloAttempts/ → results from solo (self-practice) quiz attempts
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new room in the Realtime Database and adds a summary to the host's profile.
 *
 * Two writes happen here:
 *  1. Full room data under rooms/{id}  → used by all quiz participants
 *  2. A lightweight summary under users/{hostId}/hostedRooms/{id} → shown on the dashboard
 *
 * Writing both in one function keeps them in sync.
 */
export const createRoom = async (roomData) => {
  const roomRef = ref(db, `rooms/${roomData.id}`);
  
  // Write full room data (questions, settings, etc.) to the rooms node
  await set(roomRef, {
    ...roomData,
    createdAt: Date.now()  // timestamp in milliseconds — used for sorting on the dashboard
  });

  // Write a lightweight summary to the host's profile so the dashboard
  // can load room cards quickly without reading the full room data
  const hostRoomRef = ref(db, `users/${roomData.hostId}/hostedRooms/${roomData.id}`);
  await set(hostRoomRef, {
    title: roomData.title,
    createdAt: Date.now(),
    status: roomData.status,
    students: 0 // initial student count — will be updated live as students join
  });

  return roomData.id;
};

/**
 * Fetches a room once (not real-time).
 * Used in JoinRoom.jsx to validate that the room code exists before navigating.
 */
export const getRoom = async (roomCode) => {
  const roomRef = ref(db, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

/**
 * Subscribes to real-time changes of a room using Firebase's onValue listener.
 *
 * Unlike getRoom(), this keeps a persistent WebSocket connection open and
 * fires the callback every time data under rooms/{roomCode} changes.
 * This powers the live updates in the lobby, quiz session, report, and results pages.
 *
 * Returns a cleanup function — called inside useEffect's return to stop listening
 * when the component unmounts and prevent memory leaks.
 */
export const subscribeToRoom = (roomCode, callback) => {
  const roomRef = ref(db, `rooms/${roomCode}`);
  const unsubscribe = onValue(roomRef, (snapshot) => {
    callback(snapshot.val());
  });
  
  // Return the unsubscribe function so the caller (useEffect) can clean up
  return () => {
    unsubscribe();
  };
};

/**
 * Updates a specific student's status in a room.
 * Called when a student joins — sets their name, status: 'waiting', and score: null.
 */
export const updateStudentStatus = async (roomCode, uid, statusData) => {
  const studentRef = ref(db, `rooms/${roomCode}/students/${uid}`);
  await update(studentRef, statusData);
};

/**
 * Submits final answers and score for a student, and adds room to their joinedRooms.
 *
 * Two writes happen here:
 *  1. Student's answers, score, breakdown, and status are saved under the room node
 *     (so the host can see results in the report)
 *  2. A summary is saved under the student's users/{uid}/joinedRooms node
 *     (so it appears on their personal dashboard)
 *
 * Guest users (uid === 'guest') are excluded from the personal history write
 * because they have no persistent user profile.
 */
export const submitAnswers = async (roomCode, uid, answers, score, breakdown, roomSummary) => {
  const studentRef = ref(db, `rooms/${roomCode}/students/${uid}`);
  await update(studentRef, {
    answers,
    score,
    breakdown,   // per-topic score percentages — used in the host report and results page
    status: 'finished',
    finishedAt: Date.now()
  });

  // Add to user's joinedRooms (only for authenticated, non-guest users)
  if (uid !== 'guest' && roomSummary) {
    const joinedRoomRef = ref(db, `users/${uid}/joinedRooms/${roomCode}`);
    await set(joinedRoomRef, {
      title: roomSummary.title || 'Untitled Quiz',
      host: roomSummary.hostName || 'Unknown Host',
      date: Date.now(),
      score: score
    });
  }
};

/**
 * Fetches rooms hosted by a specific user.
 * Returns an array with each room's ID merged into its data object.
 * Used by useDashboard to populate the "Hosted Rooms" section.
 */
export const getUserHostedRooms = async (uid) => {
  const hostedRef = ref(db, `users/${uid}/hostedRooms`);
  const snapshot = await get(hostedRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    // Firebase returns objects keyed by ID; we convert to an array for easier mapping in React
    return Object.entries(data).map(([id, room]) => ({ id, ...room }));
  }
  return [];
};

/**
 * Fetches rooms joined by a specific user.
 * Returns an array with each room's ID merged into its data object.
 * Used by useDashboard to populate the "Joined Rooms" section.
 */
export const getUserJoinedRooms = async (uid) => {
  const joinedRef = ref(db, `users/${uid}/joinedRooms`);
  const snapshot = await get(joinedRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.entries(data).map(([id, room]) => ({ id, ...room }));
  }
  return [];
};

/**
 * Fetches all public rooms for the Explore page.
 *
 * A room is shown publicly only if:
 *  - settings.isPublic === true  (the host opted in when creating the quiz)
 *  - status === 'finished'       (the session is over — we show completed quizzes)
 *
 * For each qualifying room, we build a lean card object (no questions/student answers)
 * to keep the data transferred to the client minimal.
 * Tags are de-duplicated using Set to avoid showing the same tag twice.
 */
export const getPublicRooms = async () => {
  const roomsRef = ref(db, 'rooms');
  const snapshot = await get(roomsRef);
  const publicRooms = [];
  
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const room = childSnapshot.val();
      if (room.settings?.isPublic && room.status === 'finished') {
        // Compute total joined
        const joinedCount = room.students ? Object.keys(room.students).length : 0;
        publicRooms.push({
          id: childSnapshot.key,
          title: room.title || 'Untitled Quiz',
          creator: room.hostName || 'Anonymous',
          questions: room.questions ? room.questions.length : 0,
          // Unique tags derived from question tags — used as filter chips on the Explore page
          tags: room.questions ? [...new Set(room.questions.map(q => q.tag).filter(Boolean))] : ['General'],
          joined: joinedCount
        });
      }
    });
  }
  
  return publicRooms;
};

/**
 * Submits final answers and score for a student doing a solo attempt.
 *
 * Unlike submitAnswers(), solo results are saved under users/{uid}/soloAttempts
 * instead of under the room's students node — because solo sessions don't
 * require the host to see them, and the student may replay the same quiz multiple times.
 *
 * Guest users are excluded because they have no persistent profile.
 */
export const submitSoloAnswers = async (roomCode, uid, answers, score, breakdown) => {
  if (uid !== 'guest') {
    const soloAttemptRef = ref(db, `users/${uid}/soloAttempts/${roomCode}`);
    await set(soloAttemptRef, {
      answers,
      score,
      breakdown,
      finishedAt: Date.now()
    });
  }
};

/**
 * Ends a live room session and syncs the final status and student count to host's profile.
 *
 * Two writes happen here:
 *  1. rooms/{roomCode}/status → 'finished'  (stops students from submitting further answers)
 *  2. users/{hostId}/hostedRooms/{roomCode} → status + final student count
 *     (keeps the dashboard summary card in sync with what actually happened)
 */
export const endRoomSession = async (roomCode, hostId, currentStudentCount) => {
  // Mark the room as finished in the main rooms node
  const roomRef = ref(db, `rooms/${roomCode}`);
  await update(roomRef, { status: 'finished' });

  // Sync the final state to the host's profile summary
  const hostRoomRef = ref(db, `users/${hostId}/hostedRooms/${roomCode}`);
  await update(hostRoomRef, {
    status: 'finished',
    students: currentStudentCount
  });
};

/**
 * Updates the student count on the host's profile dynamically.
 * Called every time a student joins or leaves the lobby so the dashboard
 * always shows the current participant count without waiting for the session to end.
 */
export const updateHostedRoomStudentCount = async (roomCode, hostId, currentStudentCount) => {
  const hostRoomRef = ref(db, `users/${hostId}/hostedRooms/${roomCode}`);
  await update(hostRoomRef, {
    students: currentStudentCount
  });
};
