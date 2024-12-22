const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketmsg')
        .setDescription('Send ticket message to channel')
        .setDefaultMemberPermissions('0'),

    async execute(interaction) {
        if (interaction.member.roles.cache.has('1317792751265386496')) {
            const embed = new EmbedBuilder()
                .setTitle('🎫 Kreipinio Sistema')
                .setDescription('Paspauskite mygtuką žemiau, kad sukurtumėte naują kreipinį')
                .setColor('#5ae717')
                .setTimestamp();

            const select = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('ticket_category')
                        .setPlaceholder('Pasirinkite kategoriją')
                        .addOptions([
                            {
                                label: 'Techninė Pagalba',
                                description: 'Techninės problemos ir klausimai',
                                value: 'tech_support',
                                emoji: '🔧'
                            },
                            {
                                label: 'Pranešimas apie Pažeidimą',
                                description: 'Pranešti apie taisyklių pažeidimą',
                                value: 'report',
                                emoji: '⚠️'
                            },
                            {
                                label: 'Bendri Klausimai',
                                description: 'Bendro pobūdžio klausimai',
                                value: 'general',
                                emoji: '❓'
                            }
                        ])
                );

            const channel = interaction.guild.channels.cache.get('1317801479192449064');
            await channel.send({ embeds: [embed], components: [select] });
            await interaction.reply({ content: 'Ticket message sent successfully!', ephemeral: true });
        }
    },
};
