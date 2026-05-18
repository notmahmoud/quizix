import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscribeToRoom } from '../lib/db';

/**
 * useHostReport — data hook for the HostReport page
 *
 * After ending a session, the host is redirected here to view a full
 * analytics report for the room.
 *
 * Responsibilities:
 *  - Subscribes to real-time room data so the report updates as late-finishing students submit
 *  - Derives all report statistics from the live room data (no separate DB query needed)
 *  - Computes per-topic averages to identify weak areas across all students
 *  - Exposes handleRemedialSession to let the host quickly create a follow-up quiz
 */
export default function useHostReport() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null); // student whose details are shown in the side panel

  // Real-time subscription — updates the report as students finish submitting
  useEffect(() => {
    const unsubscribe = subscribeToRoom(code, (data) => {
      if (data) setRoomData(data);
    });
    return () => unsubscribe();
  }, [code]);

  // Convert the students object (keyed by uid) into an array for easier iteration
  const allStudents = roomData?.students ? Object.entries(roomData.students).map(([id, s]) => ({ id, ...s })) : [];

  // Only students who have fully submitted are included in score calculations
  const finishedStudents = allStudents.filter(s => s.status === 'finished');

  const totalStudents = allStudents.length;

  // Average score across all finished students (0 if none have finished yet)
  const averageScore = finishedStudents.length > 0 
    ? Math.round(finishedStudents.reduce((acc, s) => acc + (s.score || 0), 0) / finishedStudents.length) 
    : 0;

  // Pass rate: percentage of finished students who scored 60% or above
  const passRate = finishedStudents.length > 0
    ? Math.round((finishedStudents.filter(s => (s.score || 0) >= 60).length / finishedStudents.length) * 100)
    : 0;

  // Build a per-topic score map by aggregating each student's breakdown object.
  // breakdown is a { topicName: scorePercentage } map stored per student when they submit.
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

  // Convert the topic map into an array of { name, average } objects for the chart component
  const topics = Object.entries(topicMap).map(([name, data]) => ({
    name,
    average: Math.round(data.totalScore / data.count)
  }));

  // Assemble the full report object passed to the HostReport page components
  const report = {
    overview: { totalStudents, averageScore, passRate },
    topics,
    students: allStudents
  };

  // Topics where the class average is below 50% — surfaced to the host as areas needing review
  const weakTopics = report.topics.filter(t => t.average < 50);

  // Navigates the host to the Create Quiz page to make a targeted remedial quiz
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
