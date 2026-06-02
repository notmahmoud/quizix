import { Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useHostReport from '../hooks/useHostReport';
import HostReportHeader from '../components/hostReport/HostReportHeader';
import RemedialAlert from '../components/hostReport/RemedialAlert';
import OverviewCards from '../components/hostReport/OverviewCards';
import TopicPerformanceChart from '../components/hostReport/TopicPerformanceChart';
import StudentResultsTable from '../components/hostReport/StudentResultsTable';
import StudentModal from '../components/hostReport/StudentModal';

export default function HostReport() {
  const reportState = useHostReport();

  if (!reportState.roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF9F7' }}>
        <Loader2 className="w-8 h-8 text-teal animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: '#FAF9F7' }}>
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <HostReportHeader code={reportState.code} />
        <RemedialAlert weakTopics={reportState.weakTopics} onStartRemedial={reportState.handleRemedialSession} />
        <OverviewCards overview={reportState.report.overview} />
        <TopicPerformanceChart topics={reportState.report.topics} />
        <StudentResultsTable students={reportState.report.students} onSelectStudent={reportState.setSelectedStudent} />
      </main>
      
      <StudentModal 
        student={reportState.selectedStudent} 
        roomCode={reportState.code}
        onClose={() => reportState.setSelectedStudent(null)} 
      />

      <Footer />
    </div>
  );
}
