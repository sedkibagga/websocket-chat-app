import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
type LoginProps = {
    onConnect: () => void;
};
const Login: React.FC<LoginProps> = ({ onConnect }) => {
    const { connect , currentUser } = useChat();
    const [fullName, setFullName] = useState('');
    const [nickName, setNickName] = useState('');
    console.log("currentUser in logs", currentUser);
    console.log("connect in logs", connect);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (fullName.trim() && nickName.trim()) {
            connect({
                fullName,
                nickName,
                status: 'ONLINE'
            });
            onConnect();
        }
    };

    return (
        <div className="login-container">
            <h2>Chat Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Nickname"
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                    required
                />
                <button type="submit">Connect</button>
            </form>
        </div>
    );
};

export default Login;