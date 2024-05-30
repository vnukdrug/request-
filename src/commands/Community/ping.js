const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Проверить работоспособность бота.'),

        async execute(interaction, client) {
            await interaction.deferReply({ fetchReply: true });
            await interaction.editReply('Я ем шоколадки!');
        }
}


