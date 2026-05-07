import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserHostedRooms, getUserJoinedRooms } from '../lib/db';

export default function useDashboard() {
  const { currentUser } = useAuth();
  const [hostedRooms, setHostedRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    async function fetchData() {
      try {
        setIsLoading(true);
        const [hosted, joined] = await Promise.all([
          getUserHostedRooms(currentUser.uid),
          getUserJoinedRooms(currentUser.uid)
        ]);
        hosted.sort((a, b) => b.createdAt - a.createdAt);
        joined.sort((a, b) => b.date - a.date);
        setHostedRooms(hosted);
        setJoinedRooms(joined);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [currentUser]);

  const totalHosted = hostedRooms.length;
  const totalStudents = hostedRooms.reduce((acc, room) => acc + (room.students || 0), 0);
  const roomsWithScores = joinedRooms.filter(r => r.score !== undefined && r.score !== null);
  const averageScore = roomsWithScores.length > 0 
    ? Math.round(roomsWithScores.reduce((acc, r) => acc + r.score, 0) / roomsWithScores.length) 
    : 0;
  const activeRooms = hostedRooms.filter(r => r.status === 'waiting' || r.status === 'active');
  const pastRooms = hostedRooms.filter(r => r.status === 'finished');
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  return {
    currentUser,
    isLoading,
    displayName,
    stats: { totalHosted, totalStudents, averageScore },
    activeRooms,
    pastRooms,
    joinedRooms
  };
}
