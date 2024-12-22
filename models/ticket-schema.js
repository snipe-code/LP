const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
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

module.exports = mongoose.model('UserTicket', ticketSchema);
