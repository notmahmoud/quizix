import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useLanding from '../hooks/useLanding';
import HeroSection from '../components/landing/HeroSection';
import FeaturedRoomsSection from '../components/landing/FeaturedRoomsSection';
import MissionSection from '../components/landing/MissionSection';
import AboutSection from '../components/landing/AboutSection';

export default function Landing() {
  const { featuredRooms, isLoading } = useLanding();

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <FeaturedRoomsSection featuredRooms={featuredRooms} isLoading={isLoading} />
        <MissionSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
