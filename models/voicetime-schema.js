const mongoose = require('mongoose');

const voiceTimeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    minutes: { type: Number, default: 0 }
});

module.exports = mongoose.model('VoiceTime', voiceTimeSchema);