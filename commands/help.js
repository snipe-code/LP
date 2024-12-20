const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands'),
    async execute(interaction) {
        await interaction.reply('Available commands:\n/ping - Check bot latency\n/help - Show this help message');
    }
};