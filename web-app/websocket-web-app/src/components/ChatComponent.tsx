import { Button } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import ChatCardComponent from './ChatCardComponent';
import { useChat } from '../context/ChatContext';
import apisController from '../apis/services/apisController';
import type { logoutUserDto } from '../apis/DataParam/dtos';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar.png';
import type { ChatMessage } from '../types/Types';

function ChatComponent() {
    const navigate = useNavigate();
    const { users, currentUser, disconnect, selectedUser, sendChatMessage, chatMessages, fetchChatMessages } = useChat();
    const [showUsersOnMobile, setShowUsersOnMobile] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [messageInput, setMessageInput] = useState<string>('');
    const [conversationMessages, setConversationMessages] = useState<ChatMessage[]>([]);
    console.log("chatMessages in ChatComponent:", chatMessages);
    console.log("conversationMessages in ChatComponent:", conversationMessages);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
            if (window.innerWidth >= 640) setShowUsersOnMobile(false);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // useEffect(() => {
    //     if (currentUser && selectedUser) {
    //         chatMessages.forEach((message) => {
    //             if (message.senderId === currentUser.id && message.recipientId === selectedUser.id) {
    //                 setConversationMessages(prev => [...prev, message]);
    //             } else if (message.senderId === selectedUser.id && message.recipientId === currentUser.id) {
    //                 setConversationMessages(prev => [...prev, message]);
    //             }
    //         });
    //     }
    // }, [currentUser, selectedUser, chatMessages]);

    useEffect(() => {
        if (currentUser && selectedUser) {
            const filtered = chatMessages.filter(
                msg => (msg.senderId === currentUser.id && msg.recipientId === selectedUser.id) ||
                    (msg.senderId === selectedUser.id && msg.recipientId === currentUser.id)
            );
            setConversationMessages(filtered);

        }
    }, [chatMessages, currentUser, selectedUser]);

    useEffect(() => {
        if (currentUser?.id && selectedUser?.id) {
            fetchChatMessages(currentUser.id, selectedUser.id);
            
        }
    }, [currentUser?.id, selectedUser?.id]);


    const handleDisconnect = async () => {
        try {
            if (!currentUser) return;

            const logoutData: logoutUserDto = {
                email: currentUser.email,
                id: currentUser.id
            };
            await apisController.logoutUser(logoutData);
            await disconnect();
            localStorage.removeItem('userData');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        }
    };

    const handleSendMessage = () => {
        console.log("Sending message to:", selectedUser?.nickName, "Message:", messageInput);
        if (selectedUser && messageInput.trim()) {
            sendChatMessage(selectedUser.id, messageInput);
            setMessageInput('');
            fetchChatMessages(currentUser?.id || '', selectedUser.id);

        }
    }
    return (
        <div className='flex flex-col h-screen bg-gray-900'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between bg-black h-16 sm:h-12'>
                <div className='flex w-full sm:w-1/5 bg-gray-800 items-center justify-center sm:justify-start px-4'>
                    <h1 className='text-white text-xl sm:text-2xl font-bold'>Chat App</h1>
                </div>
                <div className='flex w-full sm:w-4/5 bg-gray-900 items-center justify-center sm:justify-end px-4 py-1 sm:py-0'>
                    <div className='text-white text-sm sm:text-lg font-semibold'>
                        {currentUser?.nickName || 'User'}
                    </div>
                    <Button
                        className='text-white text-sm sm:text-lg font-semibold ml-2 sm:ml-4'
                        onClick={handleDisconnect}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className='flex flex-1 overflow-hidden relative'>
                {/* User List Sidebar - Mobile Overlay/Desktop Sidebar */}
                {/* fixed inset-0 z-20: Makes the sidebar cover the entire screen and stay above other content */}
                <div className={`
                    ${isMobile ? 'fixed inset-0 z-20 transform' : 'relative'} 
                    ${showUsersOnMobile ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
                    w-full sm:w-1/5 bg-gray-800 transition-transform duration-300 ease-in-out
                `}>
                    <div className='flex flex-col h-full p-2 '>
                        {/* Mobile Header with Close Button */}
                        {isMobile && (
                            <div className='flex justify-between items-center mb-2'>
                                <h2 className='text-white text-lg font-bold'>Users</h2>
                                <Button
                                    color="gray"
                                    size="xs"
                                    onClick={() => setShowUsersOnMobile(false)}
                                >
                                    ✕
                                </Button>
                            </div>
                        )}

                        {/* Search and Filters */}
                        <div className='mb-2'>
                            <input
                                type="text"
                                placeholder="Search Users"
                                className='w-full p-2 rounded-3xl bg-gray-700 text-white text-sm sm:text-base'
                            />
                            <div className='flex flex-col sm:flex-row sm:flex-wrap gap-2 my-2'>
                                <Button size="xs" className='w-full sm:w-auto'>
                                    Online
                                </Button>
                                <Button size="xs" className='w-full sm:w-auto'>
                                    Offline
                                </Button>
                                <Button size="xs" className='w-full sm:w-auto'>
                                    All Users
                                </Button>
                            </div>
                        </div>


                        <div className='flex-1 overflow-y-auto'>
                            <div className="space-y-2">
                                {users.map((user) => (
                                    <ChatCardComponent
                                        key={user.id}
                                        user={user}
                                        onClick={() => {
                                            if (isMobile) setShowUsersOnMobile(false);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className='flex-1 bg-gray-900 flex flex-col'>
                    {/* Mobile Show Users Button */}
                    {isMobile && !showUsersOnMobile && (
                        <div className='p-2 sm:hidden'>
                            <Button
                                className='w-full bg-blue-600 hover:bg-blue-700'
                                onClick={() => setShowUsersOnMobile(true)}
                            >
                                Show Users
                            </Button>
                        </div>
                    )}

                    {/* Chat Content */}
                    {selectedUser ? (
                        <div className='flex flex-col h-full'>
                            {/* Chat Header */}
                            <div className='flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700'>
                                <div className="flex items-center space-x-3">
                                    <div className="shrink-0 relative">
                                        <img
                                            alt={selectedUser.nickName}
                                            src={avatar}
                                            className="rounded-full h-8 w-8 sm:h-10 sm:w-10 object-cover border-2 border-blue-500"
                                        />
                                        <span className={`
                                            absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full 
                                            border-2 border-white ${selectedUser.status === 'ONLINE' ? 'bg-green-500' : 'bg-gray-400'}
                                        `}></span>
                                    </div>
                                    <div className='text-white font-medium'>
                                        {selectedUser.nickName}
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className='flex-1 overflow-y-auto p-4'>
                                {/* Messages will go here */}
                                <div className='text-gray-400 text-center py-8'>
                                    {conversationMessages.length > 0 ? (
                                        conversationMessages.map((msg, index) => (
                                            <div key={index} className={`mb-2 ${msg.senderId === currentUser?.id ? 'text-right' : 'text-left'}`}>
                                                <div className={`inline-block px-4 py-2 rounded-lg ${msg.senderId === currentUser?.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                                    {msg.content}
                                                </div>
                                                <div className='text-xs text-gray-500 mt-1'>
                                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className='text-gray-500'>No messages yet. Start chatting!</p>
                                    )}
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className='p-4 border-t border-gray-700 mb-10 sm:mb-2'>
                                <div className='flex space-x-2'>
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        className='flex-1 p-2 rounded-lg bg-gray-700 text-white'
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        value={messageInput}
                                    />
                                    <Button color="blue" onClick={handleSendMessage}>Send</Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex-1 flex items-center justify-center'>
                            <p className='text-gray-400 text-lg'>
                                {isMobile ? 'Tap "Show Users" to start chatting' : 'Select a user to start chatting'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;

// isMobile = true
// showUsersOnMobile = false
// className = 'fixed inset-0 z-20 transform -translate-x-full'
// The sidebar is positioned as a full-screen overlay (fixed inset-0)

// But hidden off-screen to the left (-translate-x-full)

// It's in the DOM but not visible

// When "Show Users" is clicked:

// jsx
// showUsersOnMobile becomes true
// className becomes 'fixed inset-0 z-20 transform translate-x-0'
// Slides in from the left to cover the entire screen

// fixed inset-0 makes it full-screen

// z-20 ensures it appears above other content

// Desktop View Behavior (screen width ≥ 640px)
// jsx
// isMobile = false
// showUsersOnMobile is ignored (forced to false)
// className = 'relative translate-x-0 w-1/5'
// relative puts it back in normal document flow

// translate-x-0 ensures no transform (fully visible)

// w-1/5 gives it 20% width

// The sidebar is always visible as a regular sidebar

// Your Understanding is Correct:
// Mobile:

// Starts hidden (-translate-x-full)

// Clicking button makes it appear (translate-x-0) as full-screen overlay

// ✕ button hides it again

// Desktop:

// Always visible as normal sidebar (relative, translate-x-0)

// No toggle buttons shown

// Takes 20% width (w-1/5)