import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { subscribeToRoom, endRoomSession, updateHostedRoomStudentCount } from '../lib/db';

export default function useHostLobby() {
  const { currentUser } = useAuth();
  const { code } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [roomStatus, setRoomStatus] = useState('waiting');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToRoom(code, (roomData) => {
      if (roomData) {
        setRoomStatus(roomData.status || 'waiting');
        if (roomData.students) {
          const studentList = Object.entries(roomData.students).map(([id, s]) => ({ id, ...s }));
          setStudents(studentList);
          if (currentUser) updateHostedRoomStudentCount(code, currentUser.uid, studentList.length).catch(console.error);
        } else {
          setStudents([]);
          if (currentUser) updateHostedRoomStudentCount(code, currentUser.uid, 0).catch(console.error);
        }
      }
    });
    return () => unsubscribe();
  }, [code, currentUser]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartQuiz = async () => {
    const roomRef = ref(db, `rooms/${code}`);
    await update(roomRef, { status: 'active' });
  };

  const handleEndSession = async () => {
    if (currentUser) {
      await endRoomSession(code, currentUser.uid, students.length);
    }
  };

  const handleViewReport = () => {
    navigate(`/room/${code}/report`, { replace: true });
  };

  return {
    code, students, roomStatus, copied,
    handleCopyCode, handleStartQuiz, handleEndSession, handleViewReport
  };
}
