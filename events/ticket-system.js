// This handles the /ticket command ticket creation
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const UserTicket = require('../models/user-ticket');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId.startsWith('ticket_category_')) {
            const category = interaction.values[0];
            const ticketNumber = interaction.customId.split('_')[2];
            let modalTitle, fields;

            switch(category) {
                case 'tech_support':
                    modalTitle = 'Techninė Pagalba';
                    fields = [
                        { id: 'problem', label: 'Aprašykite problemą', style: TextInputStyle.Paragraph },
                        { id: 'steps', label: 'Ką jau bandėte daryti?', style: TextInputStyle.Paragraph }
                    ];
                    break;
                case 'report':
                    modalTitle = 'Pranešimas apie Pažeidimą';
                    fields = [
                        { id: 'user', label: 'Vartotojo vardas', style: TextInputStyle.Short },
                        { id: 'reason', label: 'Pažeidimo priežastis', style: TextInputStyle.Paragraph }
                    ];
                    break;
                case 'general':
                    modalTitle = 'Bendri Klausimai';
                    fields = [
                        { id: 'question', label: 'Jūsų klausimas', style: TextInputStyle.Paragraph }
                    ];
                    break;
            }

            const modal = new ModalBuilder()
                .setCustomId(`ticket_modal_${category}_${ticketNumber}`)
                .setTitle(modalTitle);

            fields.forEach(field => {
                const textInput = new TextInputBuilder()
                    .setCustomId(field.id)
                    .setLabel(field.label)
                    .setStyle(field.style)
                    .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(textInput));
            });

            await interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId.startsWith('ticket_modal_')) {
            const [, , category, ticketNumber] = interaction.customId.split('_');
            const channel = await interaction.guild.channels.create({
                name: `🎫-bilietas-${ticketNumber}`,
                type: 0,
                parent: '1317792625335734364',
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['ViewChannel'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                    },
                ],
            });

            await UserTicket.create({
                guildId: interaction.guild.id,
                channelId: channel.id,
                userId: interaction.user.id,
                ticketCount: ticketNumber,
                category: category,
                hasActiveTicket: true,
                viewers: [interaction.user.id]
            });

            const closeButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('Uždaryti Kreipinį')
                        .setStyle(ButtonStyle.Danger)
                );

            let description = '';
            interaction.fields.fields.forEach(field => {
                description += `**${field.customId}:** ${field.value}\n\n`;
            });

            const ticketEmbed = new EmbedBuilder()
                .setColor('#5ae717')
                .setTitle(`🎫-bilietas-${ticketNumber} - ${getCategoryName(category)}`)
                .setDescription(description)
                .addFields(
                    { name: 'Kategorija', value: getCategoryName(category) },
                    { name: 'Sukūrė', value: `${interaction.user}` }
                )
                .setTimestamp();

            await channel.send({ embeds: [ticketEmbed], components: [closeButton] });
            await interaction.reply({ content: `Jūsų kreipinys sukurtas: ${channel}`, ephemeral: true });
        }
    },
};

function getCategoryName(category) {
    const categories = {
        'tech_support': 'Techninė Pagalba',
        'report': 'Pranešimas apie Pažeidimą',
        'general': 'Bendri Klausimai'
    };
    return categories[category] || 'Nežinoma Kategorija';
}
