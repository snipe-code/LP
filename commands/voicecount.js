const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const VoiceTime = require('../models/voicetime-schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voicecount')
        .setDescription('Rodo nario praleistą laiką balso kanaluose')
        .addUserOption(option => 
            option.setName('narys')
                .setDescription('Pasirinkite nario')
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('nario') || interaction.user;

        const voiceData = await VoiceTime.findOne({
            userId: targetUser.id,
            guildId: interaction.guild.id
        });

        const minutes = voiceData ? voiceData.minutes : 0;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        const embed = new EmbedBuilder()
            .setColor('#5ae717')
            .setTitle('🎤 Balso Kanalų Statistika')
            .setDescription(`**${targetUser.username}** praleido:\n${hours} val ${remainingMinutes} min balso kanaluose`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
