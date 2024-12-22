const mongoose = require('mongoose');

const userTicketSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        default: function() {
            return `🎫-bilietas-${this.ticketCount}`;
        }
    },
    ticketCount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['tech_support', 'report', 'general'],
        required: true
    },
    hasActiveTicket: {
        type: Boolean,
        default: true
    },
    viewers: [{
        type: String,
        required: true
    }]
}, { timestamps: true });

userTicketSchema.statics.canCreateTicket = async function(userId, guildId) {
    const activeTickets = await this.countDocuments({
        userId: userId,
        guildId: guildId,
        hasActiveTicket: true
    });
    return activeTickets < 5;
};

module.exports = mongoose.model('UserTicket', userTicketSchema);
