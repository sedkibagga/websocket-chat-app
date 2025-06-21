import { useState } from 'react';
import { BrowserRouter as Router,Route, Navigate } from 'react-router-dom';
import { Routes } from "react-router"
import { ChatProvider } from './context/ChatContext';
import Login from './components/Login';
import ChatPage from './pages/ChatPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <ChatProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route 
              path="/login" 
              element={
                isConnected ? (
                  <Navigate to="/chat" replace />
                ) : (
                  <Login onConnect={() => setIsConnected(true)} />
                )
              } 
            />
            
            <Route 
              path="/chat" 
              element={
                isConnected ? (
                  <ChatPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route
            path='/signup'
            element={
               isConnected ? (
                <Navigate to="/chat" replace />
              ) : (
                <SignUpPage />
              )
            }
            />
            <Route 
              path="/" 
              element={
                <Navigate to={isConnected ? "/chat" : "/login"} replace />
              } 
            />
          </Routes>
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;