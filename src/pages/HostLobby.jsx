import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useHostLobby from '../hooks/useHostLobby';
import LobbyHeader from '../components/hostLobby/LobbyHeader';
import LobbyActionBar from '../components/hostLobby/LobbyActionBar';
import StudentGrid from '../components/hostLobby/StudentGrid';

export default function HostLobby() {
  const {
    code, students, roomStatus, copied,
    handleCopyCode, handleStartQuiz, handleEndSession, handleViewReport
  } = useHostLobby();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF9F7' }}>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LobbyHeader code={code} copied={copied} onCopy={handleCopyCode} />
        <LobbyActionBar
          students={students}
          roomStatus={roomStatus}
          onStart={handleStartQuiz}
          onEnd={handleEndSession}
          onViewReport={handleViewReport}
        />
        <StudentGrid students={students} roomStatus={roomStatus} />
      </main>
      <Footer />
    </div>
  );
}
