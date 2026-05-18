import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { subscribeToRoom, endRoomSession, updateHostedRoomStudentCount } from '../lib/db';

/**
 * useHostLobby — data hook for the HostLobby page
 *
 * The HostLobby is the waiting room the host sees after creating a quiz.
 * Students join and appear here in real-time as they enter the room code.
 *
 * Responsibilities:
 *  - Subscribes to real-time room updates so the student list stays live
 *  - Keeps the host's dashboard student count in sync as students join
 *  - Provides actions: copy code, start quiz, end session, view report
 */
export default function useHostLobby() {
  const { currentUser } = useAuth();
  const { code } = useParams();    // room code from the URL, e.g. /room/ABC123/host
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);           // live list of students in the room
  const [roomStatus, setRoomStatus] = useState('waiting'); // 'waiting' | 'active' | 'finished'
  const [copied, setCopied] = useState(false);             // controls the "Copied!" feedback on the button

  // Subscribe to real-time room data using Firebase's onValue listener (via subscribeToRoom).
  // Every time a student joins or the room status changes, this callback fires automatically.
  useEffect(() => {
    const unsubscribe = subscribeToRoom(code, (roomData) => {
      if (roomData) {
        setRoomStatus(roomData.status || 'waiting');

        if (roomData.students) {
          // Firebase stores students as an object keyed by uid.
          // We convert it to an array so React can .map() over it easily.
          const studentList = Object.entries(roomData.students).map(([id, s]) => ({ id, ...s }));
          setStudents(studentList);

          // Keep the host's dashboard summary card in sync with the current student count
          if (currentUser) updateHostedRoomStudentCount(code, currentUser.uid, studentList.length).catch(console.error);
        } else {
          // No students key means nobody has joined yet
          setStudents([]);
          if (currentUser) updateHostedRoomStudentCount(code, currentUser.uid, 0).catch(console.error);
        }
      }
    });

    // Stop the real-time subscription when the host navigates away
    return () => unsubscribe();
  }, [code, currentUser]);

  // Copies the room code to the clipboard and shows a "Copied!" confirmation for 2 seconds
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Transitions the room status from 'waiting' → 'active'.
  // Students' QuizSession pages are subscribed to the same room node,
  // so they will detect the status change and unlock the quiz automatically.
  const handleStartQuiz = async () => {
    const roomRef = ref(db, `rooms/${code}`);
    await update(roomRef, { status: 'active' });
  };

  // Ends the session: sets room status to 'finished' and writes the final
  // student count to the host's profile summary in the database.
  const handleEndSession = async () => {
    if (currentUser) {
      await endRoomSession(code, currentUser.uid, students.length);
    }
  };

  // Navigates the host to the report page for this room.
  // replace: true prevents the browser Back button from returning to the lobby.
  const handleViewReport = () => {
    navigate(`/room/${code}/report`, { replace: true });
  };

  return {
    code, students, roomStatus, copied,
    handleCopyCode, handleStartQuiz, handleEndSession, handleViewReport
  };
}
