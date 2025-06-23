import React from 'react'
import avatar from '../assets/avatar.png';
import type { loginUserResponse } from '../apis/DataResponse/responses';
function ChatCardComponent(user: loginUserResponse) {

    return (
        <div className="p-2 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-2">
                <div className="shrink-0 relative">
                    <img
                        alt={user.nickName}
                        src={avatar}
                        className="rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-cover border-2 border-blue-500"
                    />
                    <span className={`absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-white dark:border-gray-700 ${user.status === 'ONLINE' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>                                    </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center space-x-2">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">{user.fullName}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">2 min ago</span>
                    </div>
                    <div className="flex justify-between items-center space-x-2">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Hey, how's it going?</p>
                        <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-blue-600 rounded-full">3</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatCardComponent