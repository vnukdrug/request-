const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js')

module.exports = {

    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Система запроса роли орг.'),

        async execute(interaction, client) {

            
            const zapros = new ButtonBuilder()
            .setCustomId('zapros')
            .setLabel('Запросить роль')
            .setEmoji('📩')
            .setStyle(ButtonStyle.Success)

            const forma = new ButtonBuilder()
            .setCustomId('forma')
            .setLabel('Как сделать ник по форме?')
            .setEmoji('🧐')
            .setStyle(ButtonStyle.Primary)

            const tegi = new ButtonBuilder()
            .setCustomId('tegi')
            .setLabel('Список достыпных тегов')
            .setEmoji('📃')
            .setStyle(ButtonStyle.Primary)

            const button = new ActionRowBuilder()
			.addComponents(zapros, forma, tegi);

            const response = await interaction.reply({ content: `Отправлено`, ephemeral: true })
            const message = await interaction.channel.send({ content: `✌️ Добро пожаловать в канал запроса ролей! :sparkles:\nДля того чтобы запросить роль, требуется сделать ник по форме и нажать на кнопку "Запросить роль". `, components: [button] })
            
        }
}