const Message = require('../models/message-schema');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;
        
        await Message.findOneAndUpdate(
            { userId: message.author.id, guildId: message.guild.id },
            { $inc: { count: 1 } },
            { upsert: true }
        );
    }
};
