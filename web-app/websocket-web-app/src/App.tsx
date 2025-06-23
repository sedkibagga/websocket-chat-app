import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom';
import { Routes } from "react-router"
import { ChatProvider } from './context/ChatContext';
import Login from './components/Login';
import ChatPage from './pages/ChatPage';
import SignUpPage from './pages/SignUpPage';
import ChatMessagePage from './pages/ChatMessagePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ChatProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Routes (accessible when not logged in) */}
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected Routes (only accessible when logged in) */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatMessagePage"
              element={
                <ProtectedRoute>
                  <ChatMessagePage />
                </ProtectedRoute>
              }
            />

            {/* Redirect root path based on auth status */}
            <Route
              path="/"
              element={
                localStorage.getItem('userData') ? (
                  <Navigate to="/chat" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;