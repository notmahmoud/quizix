import { useState, useEffect } from 'react';
import { getPublicRooms } from '../lib/db';

/**
 * useLanding — data hook for the Landing page
 *
 * Fetches a small set of public rooms to display as "Featured Quizzes"
 * on the homepage. Capped at 4 rooms to keep the landing page lightweight.
 */
export default function useLanding() {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const rooms = await getPublicRooms();
        // Show at most 4 rooms in the featured section
        setFeaturedRooms(rooms.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured rooms:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRooms();
  }, []); // empty dependency array — runs once on mount, no re-fetching needed

  return { featuredRooms, isLoading };
}
