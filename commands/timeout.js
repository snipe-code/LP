const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Užtildyti vartotoją')
        .addUserOption(option =>
            option.setName('vartotojas')
                .setDescription('Pasirinkite vartotoją kurį norite užtildyti')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('laikas')
                .setDescription('Pasirinkite užtildymo laiką')
                .setRequired(true)
                .addChoices(
                    { name: '1 minutė', value: '1' },
                    { name: '5 minutės', value: '5' },
                    { name: '10 minučių', value: '10' },
                    { name: '30 minučių', value: '30' },
                    { name: '1 valanda', value: '60' },
                    { name: '12 valandų', value: '720' },
                    { name: '1 diena', value: '1440' },
                    { name: '2 dienos', value: '2880' },
                    { name: '3 dienos', value: '4320' },
                    { name: '4 dienos', value: '5760' },
                    { name: '5 dienos', value: '7200' },
                    { name: '6 dienos', value: '8640' },
                    { name: '7 dienos', value: '10080' },
                    { name: '14 dienų', value: '20160' }
                ))
        .addStringOption(option =>
            option.setName('priezastis')
                .setDescription('Įveskite užtildymo priežastį')
                .setRequired(true)),

    async execute(interaction) {
        // Check if user has the required role
        if (!interaction.member.roles.cache.has('1317792751265386496')) {
            return interaction.reply({ 
                content: 'Jūs neturite teisių naudoti šią komandą! ❌', 
                ephemeral: true 
            });
        }

        const targetUser = interaction.options.getUser('vartotojas');
        const duration = parseInt(interaction.options.getString('laikas'));
        const reason = interaction.options.getString('priezastis');
        const member = await interaction.guild.members.fetch(targetUser.id);

        try {
            await member.timeout(duration * 60 * 1000, reason);

            // Success embed for command user
            const successEmbed = new EmbedBuilder()
                .setColor('#5ae717')
                .setTitle('Užtildymas Sėkmingas')
                .setDescription(`${targetUser.tag} buvo sėkmingai užtildytas. ✅`);

            // Format duration for log
            let durationText;
            if (duration >= 1440) {
                durationText = `${duration / 1440} d.`;
            } else if (duration >= 60) {
                durationText = `${duration / 60} val.`;
            } else {
                durationText = `${duration} min.`;
            }

            // Log embed for logging channel
            const logEmbed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setTitle('Naujas Užtildymas')
                .addFields(
                    { name: 'Užtildytas Vartotojas', value: targetUser.tag},
                    { name: 'Užtildė', value: interaction.user.tag},
                    { name: 'Trukmė', value: durationText},
                    { name: 'Priežastis', value: reason }
                )

            // Send success message to command user
            await interaction.reply({ embeds: [successEmbed] });

            // Send log to logging channel
            const logChannel = interaction.guild.channels.cache.get('1317802457383833620');
            if (logChannel) {
                await logChannel.send({ embeds: [logEmbed] });
            }

        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: 'Įvyko klaida bandant užtildyti vartotoją. ❌', 
                ephemeral: true 
            });
        }
    },
};