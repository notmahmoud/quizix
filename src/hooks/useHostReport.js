import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscribeToRoom } from '../lib/db';

export default function useHostReport() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToRoom(code, (data) => {
      if (data) setRoomData(data);
    });
    return () => unsubscribe();
  }, [code]);

  const allStudents = roomData?.students ? Object.entries(roomData.students).map(([id, s]) => ({ id, ...s })) : [];
  const finishedStudents = allStudents.filter(s => s.status === 'finished');

  const totalStudents = allStudents.length;
  const averageScore = finishedStudents.length > 0 
    ? Math.round(finishedStudents.reduce((acc, s) => acc + (s.score || 0), 0) / finishedStudents.length) 
    : 0;
  const passRate = finishedStudents.length > 0
    ? Math.round((finishedStudents.filter(s => (s.score || 0) >= 60).length / finishedStudents.length) * 100)
    : 0;

  const topicMap = {};
  finishedStudents.forEach(s => {
    if (s.breakdown) {
      Object.entries(s.breakdown).forEach(([topic, score]) => {
        if (!topicMap[topic]) topicMap[topic] = { totalScore: 0, count: 0 };
        topicMap[topic].totalScore += score;
        topicMap[topic].count += 1;
      });
    }
  });

  const topics = Object.entries(topicMap).map(([name, data]) => ({
    name,
    average: Math.round(data.totalScore / data.count)
  }));

  const report = {
    overview: { totalStudents, averageScore, passRate },
    topics,
    students: allStudents
  };

  const weakTopics = report.topics.filter(t => t.average < 50);

  const handleRemedialSession = () => {
    navigate('/create');
  };

  return {
    code,
    roomData,
    selectedStudent, setSelectedStudent,
    report,
    weakTopics,
    handleRemedialSession
  };
}
