"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidV4 } from 'uuid';

export default function Home() {
  const [showOptions, setShowOptions] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState(''); // New state for username
  const router = useRouter();

  const handleCreateRoom = () => {
    if (username.trim() === '') {
      alert('Please enter your name');
      return;
    }
    localStorage.setItem('username', username); // Save username
    const newRoomId = uuidV4();
    router.push(`/room/${newRoomId}`);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (username.trim() === '') {
      alert('Please enter your name');
      return;
    }
    if (roomId.trim() !== '') {
      localStorage.setItem('username', username); // Save username
      router.push(`/room/${roomId}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center w-full max-w-md">
        <h1 className="text-5xl font-bold text-cyan-400">
          Co-Dev-Studio
        </h1>
        <p className="text-lg text-gray-400 mt-2 mb-8">
          Real-time chat for developers.
        </p>

        {!showOptions ? (
          <button
            onClick={() => setShowOptions(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300"
          >
            Enter
          </button>
        ) : (
          <div className="mt-8 w-full animate-fade-in">
            {/* New Username Input */}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 mb-6 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            
            <button
              onClick={handleCreateRoom}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 mb-4"
            >
              Create a New Room
            </button>
            
            <p className="text-gray-400 my-2">OR</p>

            <form onSubmit={handleJoinRoom} className="flex flex-col items-center">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID"
                className="w-full px-4 py-3 mb-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300"
              >
                Join Room
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}