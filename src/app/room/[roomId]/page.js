"use client";

import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import io from 'socket.io-client';

let socket;

export default function Room() {
  const params = useParams();
  const roomId = params.roomId;

  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);

  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'Anonymous';
    setUsername(storedUsername);
    socket = io('https://co-dev-studio.onrender.com'); //IF POSSIBLE MAKE IT: http://localhost:3000, WHILE RUNNING THE CODE LIVE USING LOCALHOST SERVER (IF THE DEPLOYED VERSION ISNT WORKING`)
    
    socket.on('connect', () => {
      if (roomId && storedUsername) socket.emit('join-room', { roomId, username: storedUsername });
    });

    socket.on('load-history', (history) => setMessages(history));
    socket.on('receive-message', (data) => {
      setMessages((prev) => [...prev, data]);
      setTypingUsers((prev) => prev.filter(u => u !== data.username));
    });
    
    socket.on('update-user-list', (userList) => setUsers(userList));
    socket.on('update-pinned-message', (message) => setPinnedMessage(message));
    socket.on('user-typing', ({ username }) => setTypingUsers((prev) => [...new Set([...prev, username])]));
    socket.on('user-stopped-typing', ({ username } = {}) => {
      if (username) { setTypingUsers((prev) => prev.filter(u => u !== username)); } else { setTypingUsers([]); }
    });

    return () => { socket.disconnect(); };
  }, [roomId]);
  
  const uniqueUsers = useMemo(() => {
    const userNames = users.map(u => u.username);
    return [...new Set(userNames)];
  }, [users]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!message.startsWith('@ai')) {
      socket.emit('typing-start', { roomId, username });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => { socket.emit('typing-stop', { roomId }); }, 2000);
    }
  };
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      socket.emit('typing-stop', { roomId });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      const messageData = {
        roomId, text: message, username,
        socketId: socket.id, id: `${socket.id}-${Date.now()}`
      };
      socket.emit('send-message', messageData);
      if (!message.startsWith('@ai')) {
        setMessages((prev) => [...prev, messageData]);
      }
      setMessage('');
    }
  };
  
  const handlePinMessage = (messageToPin) => {
    socket.emit('pin-message', { roomId, message: messageToPin });
  };


  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className={`bg-gray-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className="p-4"><h2 className="text-lg font-bold text-cyan-400 mb-4">Members ({uniqueUsers.length})</h2>
        <ul>{uniqueUsers.map((name) => ( <li key={name} className="truncate p-1 text-gray-300">{name}</li> ))}</ul></div>
      </aside>

      <div className="flex flex-col flex-1">
        <header className="bg-gray-800 shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center"><button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4 p-1 rounded-md hover:bg-gray-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg></button><div><h1 className="text-xl font-bold text-cyan-400">Co-Dev-Studio</h1><p className="text-sm text-gray-400 truncate">Room ID: {roomId}</p></div></div>
        </header>
        {pinnedMessage && (<div className="bg-yellow-800 bg-opacity-50 text-yellow-200 p-2 text-center text-sm shadow-lg"> <span className='font-bold'>📌 {pinnedMessage.username}:</span> {pinnedMessage.text}</div>)}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col space-y-4">
             {messages.map((msg) => {
              // ** THIS IS THE FIX **
              // We now check the username instead of the temporary socket.id
              const isSender = msg.username === username;
              
              const bgColor = isSender ? 'bg-blue-600' : 'bg-gray-700';
              const alignment = isSender ? 'self-end' : 'self-start';
              const isAI = msg.username === 'AI';
              return (
                <div key={msg.id || msg._id} className={`flex flex-col max-w-2xl w-full ${alignment}`}>
                  {!isSender && <span className={`text-xs ml-2 ${isAI ? 'text-green-400' : 'text-gray-400'}`}>{msg.username}</span>}
                  <div onClick={() => handlePinMessage(msg)} className={`p-3 rounded-lg break-words cursor-pointer hover:ring-2 hover:ring-yellow-400 ${bgColor}`}><p className="whitespace-pre-wrap">{msg.text}</p></div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </main>
        <div className="h-6 px-4 text-sm text-gray-400 italic">{typingUsers.length > 0 && <span>{typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...</span>}</div>
        <footer className="bg-gray-800 p-4">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <input value={message} onChange={handleTyping} type="text" placeholder="Type your message or use @ai..." className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Send</button>
          </form>
        </footer>
      </div>
    </div>
  );
}