const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const VoiceTime = require('../models/voicetime-schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voicetop')
        .setDescription('Rodo balso kanalų aktyvumo lentelę'),
    async execute(interaction) {
        const voiceStats = await VoiceTime.find({ guildId: interaction.guild.id })
            .sort({ minutes: -1 })
            .limit(10);

        let description = '';
        for (let i = 0; i < voiceStats.length; i++) {
            const user = await interaction.client.users.fetch(voiceStats[i].userId);
            const hours = Math.floor(voiceStats[i].minutes / 60);
            const minutes = voiceStats[i].minutes % 60;
            description += `${i + 1}. ${user.username} - ${hours}val ${minutes}min\n`;
        }

        const embed = new EmbedBuilder()
            .setColor('#5ae717')
            .setTitle('🎤 Balso Kanalų Top 10')
            .setDescription(description || 'Nėra duomenų')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
