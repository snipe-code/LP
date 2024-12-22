const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const UserTicket = require('../models/user-ticket');
const Counter = require('../models/counter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Sukurti naują kreipinį'),

    async execute(interaction) {
        const existingTicket = await UserTicket.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            hasActiveTicket: true
        });

        if (existingTicket) {
            return interaction.reply({
                content: 'Jūs jau turite aktyvų kreipinį! Užbaikite jį prieš kurdami naują.',
                ephemeral: true
            });
        }

        const counter = await Counter.findOneAndUpdate(
            { _id: 'tickets' },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );

        const embed = new EmbedBuilder()
            .setTitle(`🎫-bilietas-${counter.count}`)
            .setDescription('Pasirinkite kreipinio kategoriją žemiau esančiame meniu')
            .setColor('#5ae717')
            .setTimestamp();

        const select = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`ticket_category_${counter.count}`)
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

        await interaction.reply({ 
            embeds: [embed], 
            components: [select], 
            ephemeral: true 
        });
    },
};
