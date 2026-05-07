import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { subscribeToRoom } from '../lib/db';
import { db } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import { useAuth } from '../context/AuthContext';

export default function useResults() {
  const { code, uid } = useParams();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const isSoloAttempt = new URLSearchParams(location.search).get('solo') === 'true';
  const [activeTab, setActiveTab] = useState('overview'); // overview, leaderboard
  const [roomData, setRoomData] = useState(null);
  const [soloData, setSoloData] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToRoom(code, (data) => {
      if (data) setRoomData(data);
    });
    return () => unsubscribe();
  }, [code]);

  useEffect(() => {
    if (!currentUser || !code) return;
    const fetchSoloData = async () => {
      const soloRef = ref(db, `users/${currentUser.uid}/soloAttempts/${code}`);
      const snapshot = await get(soloRef);
      if (snapshot.exists()) {
        setSoloData(snapshot.val());
      }
    };
    fetchSoloData();
  }, [code, currentUser]);

  const studentData = (roomData?.students && roomData.students[uid]) || soloData || null;
  const questions = roomData?.questions || [];
  
  // Calculate dynamic results if studentData is available
  const result = {
    score: studentData?.score || 0,
    topics: [],
    review: [],
    leaderboard: []
  };

  if (studentData && studentData.answers) {
    // Topic breakdown calculation based on student answers
    const topicMap = {};
    questions.forEach((q) => {
      const tag = q.tag || 'General';
      if (!topicMap[tag]) topicMap[tag] = { name: tag, correct: 0, total: 0 };
      
      topicMap[tag].total += 1;
      if (studentData.answers[q.id] === q.correct) {
        topicMap[tag].correct += 1;
      }

      // Review data
      const studentAnsIdx = studentData.answers[q.id];
      const isCorrect = studentAnsIdx === q.correct;
      let studentAnswerText = 'Not Answered';
      let correctAnswerText = 'Unknown';
      
      if (q.type === 'MCQ') {
        studentAnswerText = studentAnsIdx !== undefined ? q.options[studentAnsIdx] : 'Not Answered';
        correctAnswerText = q.options[q.correct];
      } else if (q.type === 'TF') {
        const tfOptions = ['True', 'False'];
        studentAnswerText = studentAnsIdx !== undefined ? tfOptions[studentAnsIdx] : 'Not Answered';
        correctAnswerText = tfOptions[q.correct];
      }

      result.review.push({
        id: q.id,
        text: q.text,
        tag: tag,
        studentAnswer: studentAnswerText,
        correctAnswer: correctAnswerText,
        isCorrect: isCorrect
      });
    });
    
    result.topics = Object.values(topicMap);
  }

  // Leaderboard Calculation
  if (roomData?.students) {
    const allStudents = Object.entries(roomData.students).map(([id, s]) => ({
      id,
      name: s.name || 'Anonymous',
      score: s.score || 0,
    }));
    
    // Sort descending by score
    allStudents.sort((a, b) => b.score - a.score);
    
    result.leaderboard = allStudents.map((s, idx) => ({
      rank: idx + 1,
      id: s.id,
      name: s.name,
      score: s.score
    }));
  }

  return {
    code,
    uid,
    isSoloAttempt,
    activeTab,
    setActiveTab,
    roomData,
    result
  };
}
