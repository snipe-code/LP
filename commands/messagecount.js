const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Message = require('../models/message-schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('messagecount')
        .setDescription('Parodyti nario žinučių kiekį')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Narys, kurio žinučių kiekį pažiūrėti')
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        
        const messageData = await Message.findOne({
            userId: targetUser.id,
            guildId: interaction.guild.id
        });

        const embed = new EmbedBuilder()
            .setColor('#5ae717')
            .setTitle('Žinučių kiekis')
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                { name: 'Narys:', value: targetUser.tag },
                { name: 'Išsiųsta žinučių:', value: messageData?.count.toString() || '0' }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
