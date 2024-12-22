const VoiceTime = require('../models/voicetime-schema');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        if (!oldState.channelId && newState.channelId) {
            // User joined a voice channel
            newState.member.voiceJoinTime = Date.now();
        } else if (oldState.channelId && !newState.channelId) {
            // User left a voice channel
            const joinTime = oldState.member.voiceJoinTime;
            if (joinTime) {
                const minutes = Math.floor((Date.now() - joinTime) / 60000);
                await VoiceTime.findOneAndUpdate(
                    { userId: oldState.member.id, guildId: oldState.guild.id },
                    { $inc: { minutes: minutes } },
                    { upsert: true }
                );
            }
        }
    }
};
