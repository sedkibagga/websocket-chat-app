import { Button } from 'flowbite-react'
import React from 'react'
import ChatCardComponent from './ChatCardComponent';
import { useChat } from '../context/ChatContext';
import apisController from '../apis/services/apisController';
import type { logoutUserDto } from '../apis/DataParam/dtos';
import { useNavigate } from 'react-router-dom';
import { webSocketService } from '../services/WebSocketService';
function ChatComponent() {
    const Navigate = useNavigate();
    const { users, currentUser, disconnect } = useChat();
    console.log("users in ChatComponent still connected:", users);
    console.log("currentUser in ChatComponent:", currentUser);
    const handleDisconnect = async () => {
        try {
            if (!currentUser) return;

            const logoutData: logoutUserDto = {
                email: currentUser.email,
                id: currentUser.id
            };
            await apisController.logoutUser(logoutData);
            // 1. Disconnect WebSocket (will notify server)
            await disconnect();

            // 2. Call logout API


            // 3. Clear local state
            localStorage.removeItem('userData');

            // 4. Navigate
            Navigate('/login');

        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        }
    };
    return (
        <div className='flex flex-col h-screen bg-gray-900'>

            <div className='flex flex-col sm:flex-row justify-between bg-black h-16 sm:h-12'>
                <div className='flex w-full sm:w-1/5 bg-gray-800 items-center justify-center sm:justify-start px-4'>
                    <h1 className='text-white text-xl sm:text-2xl font-bold'>Chat App</h1>
                </div>
                <div className='flex w-full sm:w-4/5 bg-gray-900 items-center justify-center sm:justify-end px-4 py-1 sm:py-0'>
                    <div className='text-white text-sm sm:text-lg font-semibold'>
                        John Doe
                    </div>
                    <div className='text-white text-sm sm:text-lg font-semibold ml-2 sm:ml-4'>
                        Jane Smith
                    </div>
                    <Button className='text-white text-sm sm:text-lg font-semibold ml-2 sm:ml-4' onClick={handleDisconnect}>
                        LogOut
                    </Button>
                </div>
            </div>


            <div className='flex flex-col sm:flex-row flex-1 overflow-hidden'>

                <div className='flex flex-col w-full sm:w-1/5 bg-gray-800 p-2 overflow-hidden'>

                    <input
                        type="text"
                        placeholder="Search Users"
                        className='w-full p-2 my-2 rounded-3xl bg-gray-700 text-white text-sm sm:text-base'
                    />


                    <div className='flex flex-col sm:flex-row sm:flex-wrap gap-2 my-2'>
                        <Button
                            className='bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2'
                            onClick={() => console.log('Online Users')}
                        >
                            Online
                        </Button>
                        <Button
                            className='bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2'
                            onClick={() => console.log('Offline Users')}
                        >
                            Offline
                        </Button>
                        <Button
                            className='bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2'
                            onClick={() => console.log('All Users')}
                        >
                            All Users
                        </Button>
                    </div>


                    <div className='flex-1 overflow-y-auto mt-3 '>
                        <div className="space-y-2">
                            {users.map((user) => (
                                <ChatCardComponent key={user.id} {...user} />
                            ))}


                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className='flex-1 bg-gray-900 p-4 hidden sm:flex flex-col'>
                    <div className='flex-1 flex items-center justify-center'>
                        <p className='text-gray-400 text-lg'>Select a chat to start messaging</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatComponent