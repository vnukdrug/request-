const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Вернуть введенное сообщение')
        .addStringOption(option =>
            option.setName('сообщение')
                .setDescription('Введите сообщение.')),
                
        async execute(interaction, client) {
            const message = interaction.options.getString('сообщение') ?? `${interaction.user} ничего не указал в сообщении!`;
            await interaction.reply(message);
            

        }
}