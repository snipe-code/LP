const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const QRCode = require('qrcode');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qrcode')
        .setDescription('Sugeneruoja QR kodą iš teksto/nuorodos')
        .addStringOption(option =>
            option.setName('tekstas')
                .setDescription('Tekstas, kurį norite paversti į QR kodą')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        
        const text = interaction.options.getString('tekstas/nuoroda');
        
        try {
            const qrBuffer = await QRCode.toBuffer(text);
            
            const qrEmbed = new EmbedBuilder()
                .setColor('#5ae717')
                .setTitle('QR Kodas Sugeneruotas!')
                .setDescription(`QR kodas veda į: ${text}`)
                .setImage('attachment://qrcode.png')
                .setTimestamp();

            await interaction.editReply({
                embeds: [qrEmbed],
                files: [{
                    attachment: qrBuffer,
                    name: 'qrcode.png'
                }]
            });
        } catch (error) {
            await interaction.editReply('Įvyko klaida generuojant QR kodą. Bandykite dar kartą.');
        }
    },
};
