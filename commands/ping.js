const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Parodo boto atsilikimą (ping)'),
    async execute(interaction) {
        const sent = await interaction.reply({ 
            content: 'Apskaičiuojamas ping...', 
            fetchReply: true 
        });
        
        const pingEmbed = new EmbedBuilder()
            .setColor('#5ae717')
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Atsilikimas (ping)', value: `\`${sent.createdTimestamp - interaction.createdTimestamp}ms\``},
                { name: 'API atsilikimas', value: `\`${Math.round(interaction.client.ws.ping)}ms\``}
            )
            .setTimestamp();

        await interaction.editReply({ content: null, embeds: [pingEmbed] });
    },
};
