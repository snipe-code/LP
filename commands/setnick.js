const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnick')
        .setDescription('Pakeisti vartotojo slapyvardį')
        .addUserOption(option =>
            option.setName('vartotojas')
                .setDescription('Pasirinkite vartotoją kuriam norite pakeisti slapyvardį')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('slapyvardis')
                .setDescription('Įveskite naują slapyvardį')
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
        const newNickname = interaction.options.getString('slapyvardis');
        const member = await interaction.guild.members.fetch(targetUser.id);

        try {
            await member.setNickname(newNickname);

            // Success embed for command user
            const successEmbed = new EmbedBuilder()
                .setColor('#5ae717')
                .setTitle('Slapyvardžio Pakeitimas Sėkmingas')
                .setDescription(`${targetUser.tag} slapyvardis pakeistas į ${newNickname}. ✅`);

            // Log embed for logging channel
            const logEmbed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setTitle('Naujas Slapyvardžio Pakeitimas')
                .addFields(
                    { name: 'Vartotojas', value: targetUser.tag},
                    { name: 'Pakeitė', value: interaction.user.tag},
                    { name: 'Naujas Slapyvardis', value: newNickname},
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
                content: 'Įvyko klaida bandant pakeisti slapyvardį. ❌',
                ephemeral: true
            });
        }
    },
};
