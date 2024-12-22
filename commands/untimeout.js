const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Atšaukti vartotojo užtildymą')
        .addUserOption(option =>
            option.setName('vartotojas')
                .setDescription('Pasirinkite vartotoją kuriam norite atšaukti užtildymą')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('priezastis')
                .setDescription('Įveskite užtildymo atšaukimo priežastį')
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
        const reason = interaction.options.getString('priezastis');
        const member = await interaction.guild.members.fetch(targetUser.id);

        try {
            await member.timeout(null, reason);

            // Success embed for command user
            const successEmbed = new EmbedBuilder()
                .setColor('#5ae717')
                .setTitle('Užtildymo Atšaukimas Sėkmingas')
                .setDescription(`${targetUser.tag} užtildymas buvo sėkmingai atšauktas. ✅`);

            // Log embed for logging channel
            const logEmbed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setTitle('Užtildymo Atšaukimas')
                .addFields(
                    { name: 'Vartotojas', value: targetUser.tag},
                    { name: 'Atšaukė', value: interaction.user.tag},
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
                content: 'Įvyko klaida bandant atšaukti vartotojo užtildymą. ❌',
                ephemeral: true
            });
        }
    },
};
