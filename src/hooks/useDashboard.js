// useState  → manage local component state
// useEffect → run side-effects (data fetching, subscriptions) after render
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserHostedRooms, getUserJoinedRooms } from '../lib/db';

/**
 * useDashboard — data hook for the Dashboard page
 *
 * Responsibilities:
 *  - Fetches the logged-in user's hosted rooms and joined rooms from Firebase (one-time read)
 *  - Derives all statistics shown on the dashboard (totals, averages, active/past splits)
 *  - Returns everything the Dashboard component needs — keeping the page component clean and
 *    focused only on rendering
 *
 * Pattern used: "Custom Hook as data layer"
 * The page (Dashboard.jsx) calls this hook and just destructures what it needs.
 * Business logic lives here, not in the JSX.
 */
export default function useDashboard() {
  const { currentUser } = useAuth(); // the currently logged-in user from AuthContext

  const [hostedRooms, setHostedRooms] = useState([]); // rooms this user created as a host
  const [joinedRooms, setJoinedRooms] = useState([]); // rooms this user joined as a student
  const [isLoading, setIsLoading] = useState(true);   // controls the loading spinner on the page

  // Fetch both hosted and joined rooms once when the component mounts (or when currentUser changes).
  // We use Promise.all so both requests run in parallel — faster than awaiting them one by one.
  useEffect(() => {
    // If there's no logged-in user yet, do nothing (AuthContext might still be initializing)
    if (!currentUser) return;

    async function fetchData() {
      try {
        setIsLoading(true);

        // Run both DB reads simultaneously and wait for both to finish
        const [hosted, joined] = await Promise.all([
          getUserHostedRooms(currentUser.uid),
          getUserJoinedRooms(currentUser.uid)
        ]);

        // Sort hosted rooms newest-first by createdAt (Unix timestamp)
        hosted.sort((a, b) => b.createdAt - a.createdAt);

        // Sort joined rooms newest-first by date (Unix timestamp set when the student submitted)
        joined.sort((a, b) => b.date - a.date);

        setHostedRooms(hosted);
        setJoinedRooms(joined);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        // Always clear the loading state, even if an error occurred
        setIsLoading(false);
      }
    }
    fetchData();
  }, [currentUser]); // re-run if the user logs out and back in

  // ─── Derived statistics (calculated from state, not stored separately) ────────

  // Total number of rooms this user has hosted
  const totalHosted = hostedRooms.length;

  // Total unique students across all hosted rooms
  // room.students is stored as a count (number) on the dashboard summary,
  // so we simply sum them up
  const totalStudents = hostedRooms.reduce((acc, room) => acc + (room.students || 0), 0);

  // Only include joined rooms where a score was actually recorded
  // (some rooms may have been joined but not submitted)
  const roomsWithScores = joinedRooms.filter(r => r.score !== undefined && r.score !== null);

  // Average score as a whole number percentage (0 if the student hasn't finished any quiz)
  const averageScore = roomsWithScores.length > 0
    ? Math.round(roomsWithScores.reduce((acc, r) => acc + r.score, 0) / roomsWithScores.length)
    : 0;

  // Rooms currently in 'waiting' (lobby open) or 'active' (quiz running) — shown as "Active" on dashboard
  const activeRooms = hostedRooms.filter(r => r.status === 'waiting' || r.status === 'active');

  // Rooms where the session has ended — shown in the "Past" tab on the dashboard
  const pastRooms = hostedRooms.filter(r => r.status === 'finished');

  // Display name fallback chain: Auth displayName → email prefix → generic 'User'
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  // Everything the Dashboard page needs, returned as a flat object
  return {
    currentUser,
    isLoading,
    displayName,
    stats: { totalHosted, totalStudents, averageScore }, // grouped for clean prop passing
    activeRooms,
    pastRooms,
    joinedRooms
  };
}
