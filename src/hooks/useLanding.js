import { useState, useEffect } from 'react';
import { getPublicRooms } from '../lib/db';

export default function useLanding() {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const rooms = await getPublicRooms();
        setFeaturedRooms(rooms.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured rooms:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRooms();
  }, []);

  return { featuredRooms, isLoading };
}
