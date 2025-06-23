import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom';
import { Routes } from "react-router"
import { ChatProvider } from './context/ChatContext';
import Login from './components/Login';
import ChatPage from './pages/ChatPage';
import SignUpPage from './pages/SignUpPage';
import ChatMessagePage from './pages/ChatMessagePage';
import ProtectedRoute from './routesProtection/ProtectedRoute';
import LoginSignUpProtection from './routesProtection/LoginSignUpProtection';

function App() {
  return (
    <ChatProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Routes (accessible when not logged in) */}
            <Route path="/login" element={
              <LoginSignUpProtection>
              <Login/>
              </LoginSignUpProtection>
              } />
            <Route path="/signup" element={
              <LoginSignUpProtection>
              <SignUpPage />
              </LoginSignUpProtection>
              } />

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
            <Route path="/" element={
              <LoginSignUpProtection>
                <Navigate to="/login" replace />
              </LoginSignUpProtection>
            } />
          </Routes>
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;