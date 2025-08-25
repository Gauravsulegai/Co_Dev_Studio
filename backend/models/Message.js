const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    roomId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    socketId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;