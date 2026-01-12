import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreateGigPage from './pages/CreateGigPage';
import GigDetailsPage from './pages/GigDetailsPage';
import { Loader2 } from 'lucide-react';
import './index.css';

// Component to protect routes that require authentication
const ProtectedRoute = ({ children }: { children: any }) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="h-screen w-full flex justify-center items-center"><Loader2 className="animate-spin text-green-600" /></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Component to redirect authenticated users away from public auth pages
const PublicRoute = ({ children }: { children: any }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="h-screen w-full flex justify-center items-center"><Loader2 className="animate-spin text-green-600" /></div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const AppContent = () => {
    const { user } = useAuth();
    const userId = user ? user._id : null;

    return (
        <SocketProvider userId={userId}>
            <Layout>
                <Routes>
                    {/* Public Routes (only for non-authenticated) */}
                    <Route path="/login" element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    } />
                    <Route path="/signup" element={
                        <PublicRoute>
                            <SignupPage />
                        </PublicRoute>
                    } />
                    
                    {/* Protected Routes (for authenticated users only) */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/create-gig" element={
                        <ProtectedRoute>
                            <CreateGigPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/gigs/:id" element={
                        <ProtectedRoute>
                            <GigDetailsPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Layout>
        </SocketProvider>
    );
};

function App() {
  return (
    <Router>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </Router>
  );
}

export default App;
