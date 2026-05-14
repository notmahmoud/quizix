import { db } from './firebase';
import { ref, set, get, update, onValue } from 'firebase/database';

/**
 * Creates a new room in the Realtime Database and adds a summary to the host's profile
 */
export const createRoom = async (roomData) => {
  const roomRef = ref(db, `rooms/${roomData.id}`);
  
  // Write to rooms
  await set(roomRef, {
    ...roomData,
    createdAt: Date.now()
  });

  // Write summary to users/{uid}/hostedRooms
  const hostRoomRef = ref(db, `users/${roomData.hostId}/hostedRooms/${roomData.id}`);
  await set(hostRoomRef, {
    title: roomData.title,
    createdAt: Date.now(),
    status: roomData.status,
    students: 0 // initial student count
  });

  return roomData.id;
};

/**
 * Fetches a room once
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
 * Subscribes to real-time changes of a room
 */
export const subscribeToRoom = (roomCode, callback) => {
  const roomRef = ref(db, `rooms/${roomCode}`);
  const unsubscribe = onValue(roomRef, (snapshot) => {
    callback(snapshot.val());
  });
  
  return () => {
    unsubscribe();
  };
};

/**
 * Updates a specific student's status in a room
 */
export const updateStudentStatus = async (roomCode, uid, statusData) => {
  const studentRef = ref(db, `rooms/${roomCode}/students/${uid}`);
  await update(studentRef, statusData);
};

/**
 * Submits final answers and score for a student, and adds room to their joinedRooms
 */
export const submitAnswers = async (roomCode, uid, answers, score, breakdown, roomSummary) => {
  const studentRef = ref(db, `rooms/${roomCode}/students/${uid}`);
  await update(studentRef, {
    answers,
    score,
    breakdown,
    status: 'finished',
    finishedAt: Date.now()
  });

  // Add to user's joinedRooms
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
 * Fetches rooms hosted by a specific user
 */
export const getUserHostedRooms = async (uid) => {
  const hostedRef = ref(db, `users/${uid}/hostedRooms`);
  const snapshot = await get(hostedRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.entries(data).map(([id, room]) => ({ id, ...room }));
  }
  return [];
};

/**
 * Fetches rooms joined by a specific user
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
 * Fetches all public rooms
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
          tags: room.questions ? [...new Set(room.questions.map(q => q.tag).filter(Boolean))] : ['General'],
          joined: joinedCount
        });
      }
    });
  }
  
  return publicRooms;
};

/**
 * Submits final answers and score for a student doing a solo attempt
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
 * Ends a live room session and syncs the final status and student count to host's profile
 */
export const endRoomSession = async (roomCode, hostId, currentStudentCount) => {
  // Update room status
  const roomRef = ref(db, `rooms/${roomCode}`);
  await update(roomRef, { status: 'finished' });

  // Update host's profile
  const hostRoomRef = ref(db, `users/${hostId}/hostedRooms/${roomCode}`);
  await update(hostRoomRef, {
    status: 'finished',
    students: currentStudentCount
  });
};

/**
 * Updates the student count on the host's profile dynamically
 */
export const updateHostedRoomStudentCount = async (roomCode, hostId, currentStudentCount) => {
  const hostRoomRef = ref(db, `users/${hostId}/hostedRooms/${roomCode}`);
  await update(hostRoomRef, {
    students: currentStudentCount
  });
};
