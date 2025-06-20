import { useState } from 'react'
import { ChatProvider } from './context/ChatContext';
import ChatUI from './components/ChatUI';
import Login from './components/Login';

function App() {
  const [count, setCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false);

  return (
    <ChatProvider>
      <div className="app">
        {isConnected ? <ChatUI /> : <Login onConnect={() => setIsConnected(true)} />}
      </div>
    </ChatProvider>
  )
}

export default App
