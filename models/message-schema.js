const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    count: { type: Number, default: 0 }
});

module.exports = mongoose.model('Message', messageSchema);