// const express = require('express');
// const dotenv = require('dotenv');
// dotenv.config();

// const mongoose = require('mongoose');
// const http = require('http');
// const { Server } = require("socket.io");
// const cors = require('cors');
// const Room = require('./models/Room');
// const Message = require('./models/Message');
// // We are no longer using the OpenAI library, so we can remove it.
// // const OpenAI = require('openai'); 

// const app = express();
// app.use(cors());

// /* We are disabling the OpenAI initialization
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// */

// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] } });

// const PORT = process.env.PORT || 5000;
// const roomUsers = {};

// app.get('/', (req, res) => { res.send('Backend server is running!'); });

// io.on('connection', (socket) => {
//   console.log(`✅ User connected: ${socket.id}`);

//   socket.on('join-room', async ({ roomId, username }) => {
//     socket.join(roomId);
//     if (!roomUsers[roomId]) roomUsers[roomId] = [];
//     roomUsers[roomId].push({ id: socket.id, username });
//     socket.data.username = username;
//     socket.data.roomId = roomId;
//     io.to(roomId).emit('update-user-list', roomUsers[roomId]);
//     let room = await Room.findOne({ roomId });
//     if (!room) room = await new Room({ roomId }).save();
//     if (room.pinnedMessage) socket.emit('update-pinned-message', room.pinnedMessage);
//     const messageHistory = await Message.find({ roomId }).sort({ timestamp: 1 }).limit(50);
//     socket.emit('load-history', messageHistory);
//   });
  
//   socket.on('pin-message', async ({ roomId, message }) => {
//     await Room.updateOne({ roomId }, { pinnedMessage: message });
//     io.to(roomId).emit('update-pinned-message', message);
//   });

//   socket.on('send-message', async (data) => {
//     if (!data.text.startsWith('@ai ')) {
//       const newMessage = new Message({
//         roomId: data.roomId, username: data.username,
//         text: data.text, socketId: data.socketId
//       });
//       await newMessage.save();
//     }
    
//     // ** THIS IS THE MODIFIED AI BLOCK **
//     if (data.text.startsWith('@ai ')) {
//       const disabledMessage = {
//           roomId: data.roomId, text: "The AI feature is currently disabled by the administrator.",
//           username: 'AI', socketId: 'ai-disabled', id: `ai-disabled-${Date.now()}`
//       };
//       io.to(data.roomId).emit('receive-message', disabledMessage);
//     } else {
//       socket.to(data.roomId).emit('receive-message', data);
//     }
//   });

//   socket.on('typing-start', ({ roomId, username }) => socket.to(roomId).emit('user-typing', { username }));
//   socket.on('typing-stop', ({ roomId }) => socket.to(roomId).emit('user-stopped-typing'));

//   socket.on('disconnect', () => {
//     console.log(`❌ User disconnected: ${socket.id}`);
//     const { roomId, username } = socket.data;
//     if (roomId && roomUsers[roomId]) {
//       roomUsers[roomId] = roomUsers[roomId].filter(user => user.id !== socket.id);
//       io.to(roomId).emit('update-user-list', roomUsers[roomId]);
//       socket.to(roomId).emit('user-stopped-typing', { username });
//     }
//   });
// });

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected successfully.");
//     server.listen(PORT, () => { console.log(`🚀 Server is running on http://localhost:${PORT}`); });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });






const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const Room = require('./models/Room');
const Message = require('./models/Message');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // ** THIS IS THE FIX **
    // We now allow both our local and deployed frontends to connect
    origin: ["http://localhost:3000", "https://your-live-frontend-url.vercel.app"],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const roomUsers = {};

app.get('/', (req, res) => { res.send('Backend server is running!'); });

// ... (The rest of your io.on('connection', ...) and mongoose.connect(...) code remains exactly the same)
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on('join-room', async ({ roomId, username }) => {
    socket.join(roomId);
    if (!roomUsers[roomId]) roomUsers[roomId] = [];
    roomUsers[roomId].push({ id: socket.id, username });
    socket.data.username = username;
    socket.data.roomId = roomId;
    io.to(roomId).emit('update-user-list', roomUsers[roomId]);
    let room = await Room.findOne({ roomId });
    if (!room) room = await new Room({ roomId }).save();
    if (room.pinnedMessage) socket.emit('update-pinned-message', room.pinnedMessage);
    const messageHistory = await Message.find({ roomId }).sort({ timestamp: 1 }).limit(50);
    socket.emit('load-history', messageHistory);
  });

  socket.on('pin-message', async ({ roomId, message }) => {
    await Room.updateOne({ roomId }, { pinnedMessage: message });
    io.to(roomId).emit('update-pinned-message', message);
  });

  socket.on('send-message', async (data) => {
    if (!data.text.startsWith('@ai ')) {
      const newMessage = new Message({
        roomId: data.roomId, username: data.username,
        text: data.text, socketId: data.socketId
      });
      await newMessage.save();
    }

    if (data.text.startsWith('@ai ')) {
      const disabledMessage = {
          roomId: data.roomId, text: "The AI feature is currently disabled by the administrator.",
          username: 'AI', socketId: 'ai-disabled', id: `ai-disabled-${Date.now()}`
      };
      io.to(data.roomId).emit('receive-message', disabledMessage);
    } else {
      socket.to(data.roomId).emit('receive-message', data);
    }
  });

  socket.on('typing-start', ({ roomId, username }) => socket.to(roomId).emit('user-typing', { username }));
  socket.on('typing-stop', ({ roomId }) => socket.to(roomId).emit('user-stopped-typing'));

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    const { roomId, username } = socket.data;
    if (roomId && roomUsers[roomId]) {
      roomUsers[roomId] = roomUsers[roomId].filter(user => user.id !== socket.id);
      io.to(roomId).emit('update-user-list', roomUsers[roomId]);
      socket.to(roomId).emit('user-stopped-typing', { username });
    }
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully.");
    server.listen(PORT, () => { console.log(`🚀 Server is running on http://localhost:${PORT}`); });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });