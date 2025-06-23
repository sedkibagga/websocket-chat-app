import { Button } from 'flowbite-react'
import React from 'react'

function ChatComponent() {
    return (
        <>
            <div className='flex flex-col h-screen bg-red-600'>

                <div className='flex flex-row justify-between bg-black h-1/12'>
                    <div className='flex w-1/5 bg-gray-800 items-center'>
                        <h1 className='text-white text-2xl font-bold ml-4'>Chat App</h1>
                    </div>
                    <div className='flex w-4/5 bg-gray-900 mt-2 items-center justify-end pr-4'>
                        <div className='text-white text-lg font-semibold'>
                            John Doe

                        </div>
                        <div className='text-white text-lg font-semibold ml-4'>
                            John Doe

                        </div>
                    </div>
                </div>
                <div className='flex flex-row bg-blue-600 h-11/12'>
                    <div className='flex w-1/5 bg-gray-800 mt-2 flex-col'>
                        <input
                            type="text"
                            placeholder="Search Users"
                            className='w-4/5 p-2 m-2  rounded-3xl bg-gray-700 text-white'
                        />

                        <div className='flex flex-col md:flex-row bg-red-600 mt-2'>
                            <div className='flex flex-col md:flex-row md:justify-between w-full md:w-2/3 bg-yellow-300 gap-2'>
                                <Button
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold rounded'
                                    onClick={() => console.log('Add User')}
                                >
                                    Add User
                                </Button>
                                <Button
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold rounded'
                                    onClick={() => console.log('Add User')}
                                >
                                    Add User
                                </Button>
                                <Button
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold rounded'
                                    onClick={() => console.log('Add User')}
                                >
                                    Add User
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='flex w-4/5 bg-gray-900 mt-2'>

                    </div>
                </div>

            </div>
        </>
    )
}

export default ChatComponent