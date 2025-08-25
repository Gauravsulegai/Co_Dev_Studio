const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    pinnedMessage: {
        type: Object, // We'll store the whole message object here
        default: null
    }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;