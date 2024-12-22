// This handles the public message ticket creation
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const UserTicket = require('../models/user-ticket');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_category') {
            const category = interaction.values[0];
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
                .setCustomId(`ticketmsg_modal_${category}`)
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

        if (interaction.isModalSubmit() && interaction.customId.startsWith('ticketmsg_modal_')) {
            const counter = await Counter.findOneAndUpdate(
                { _id: 'tickets' },
                { $inc: { count: 1 } },
                { upsert: true, new: true }
            );

            const [, , category] = interaction.customId.split('_');
            const channel = await interaction.guild.channels.create({
                name: `🎫-bilietas-${counter.count}`,
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
                ticketCount: counter.count,
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
                .setTitle(`🎫-bilietas-${counter.count} - ${getCategoryName(category)}`)
                .setDescription(description)
                .addFields(
                    { name: 'Kategorija', value: getCategoryName(category) },
                    { name: 'Sukūrė', value: `${interaction.user}` }
                )
                .setTimestamp();

            await channel.send({ embeds: [ticketEmbed], components: [closeButton] });
            await interaction.reply({ content: `Jūsų kreipinys sukurtas: ${channel}`, ephemeral: true });
        }

        if (interaction.isButton() && interaction.customId === 'close_ticket') {
            const channel = interaction.channel;
            
            const ticket = await UserTicket.findOne({
                channelId: channel.id
            });

            if (ticket) {
                await UserTicket.findOneAndUpdate(
                    { channelId: channel.id },
                    { 
                        hasActiveTicket: false,
                        $pull: { viewers: ticket.userId }
                    }
                );
            }

            await channel.setParent('1320104494775930935');
            
            const closedEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Kreipinys Uždarytas')
                .setDescription(`Uždarė: ${interaction.user}`)
                .setTimestamp();

            await interaction.reply({ embeds: [closedEmbed] });
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
