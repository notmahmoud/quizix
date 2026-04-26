import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import JoinRoom from './pages/JoinRoom';
import HostLobby from './pages/HostLobby';
import QuizSession from './pages/QuizSession';
import Results from './pages/Results';
import HostReport from './pages/HostReport';
import Explore from './pages/Explore';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/explore" element={<Explore />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
      <Route path="/room/:code/host" element={<ProtectedRoute><HostLobby /></ProtectedRoute>} />
      <Route path="/room/:code/quiz" element={<ProtectedRoute><QuizSession /></ProtectedRoute>} />
      <Route path="/room/:code/results/:uid" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      <Route path="/room/:code/report" element={<ProtectedRoute><HostReport /></ProtectedRoute>} />
      
      {/* Redirect /join to quiz session if needed, for now we will assume the join logic handles redirecting */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
