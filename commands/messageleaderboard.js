const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Message = require('../models/message-schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('messagetop')
        .setDescription('Parodyti TOP 10 žinučių siuntėjų'),
    async execute(interaction) {
        const topUsers = await Message.find({ guildId: interaction.guild.id })
            .sort({ count: -1 })
            .limit(10);

        const userRank = await Message.countDocuments({
            guildId: interaction.guild.id,
            count: { $gt: (await Message.findOne({ 
                userId: interaction.user.id,
                guildId: interaction.guild.id 
            }))?.count || 0 }
        }) + 1;

        const userMessages = await Message.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        });

        let description = '';
        for (let i = 0; i < topUsers.length; i++) {
            const user = await interaction.client.users.fetch(topUsers[i].userId);
            const isCurrentUser = user.id === interaction.user.id;
            const line = `${i + 1}. ${isCurrentUser ? '**' : ''}${user.tag} - ${topUsers[i].count} žinučių ${isCurrentUser ? '**' : ''}\n`;
            description += line;
        }

        const embed = new EmbedBuilder()
            .setColor('#5ae717')
            .setTitle('Žinučių lyderių lentelė')
            .setDescription(description)
            .setFooter({ 
                text: `Tavo vieta: #${userRank} | Žinučių iš viso: ${userMessages?.count || 0}` 
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
