const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rest')
        .setDescription('Что то типа ресторана'),

        async execute(interaction, client) {

            const grysha = new ButtonBuilder()
			.setCustomId('grysha')
			.setLabel('Груша')
			.setStyle(ButtonStyle.Success)
            .setEmoji('🍐');

            const apple = new ButtonBuilder()
			.setCustomId('apple')
			.setLabel('Яблоко')
			.setStyle(ButtonStyle.Success)
            .setEmoji('🍎');
            
            const banana = new ButtonBuilder()
			.setCustomId('banana')
			.setLabel('Банан')
			.setStyle(ButtonStyle.Success)
            .setEmoji('🍌');
            const back = new ButtonBuilder()
			.setCustomId('back')
			.setLabel('Назад')
			.setStyle(ButtonStyle.Secondary)
            .setEmoji('🔙');

            const row = new ActionRowBuilder()
			.addComponents(grysha, apple ,banana);
            const row2 = new ActionRowBuilder()
			.addComponents(back);


            const response = await interaction.reply({
                content: `🏪 Выберете пряедложенный товар: \n\n1. 🍐 Груша\n2. 🍎 Яблоко\n3. 🍌 Банан`,
                components: [row],
            })
            const collectorFilter = i => i.user.id === interaction.user.id;
            try {
                const collector = response.createMessageComponentCollector({ filter: collectorFilter });
                collector.on("collect", async (confirmation) => {
                    if (confirmation.customId === 'grysha') {
                        await confirmation.update({ content: `Вы успешно заказали груши.`, components: [row2] });
                    } else if (confirmation.customId === 'apple') {
                        await confirmation.update({ content: 'Вы успешно заказали яблоко', components: [row2] });
                    } else if (confirmation.customId === 'banana') {
                        await confirmation.update({ content: 'Вы успешно заказали банан', components: [row2] });
                    }
                    if (confirmation.customId === 'back') {
                        await confirmation.update({ content: '🏪 Выберете предложенный товар: \n\n1. 🍐 Груша\n2. 🍎 Яблоко\n3. 🍌 Банан', components: [row] });
                    }
                })
            } catch (e) {
             console.log(e)
                await interaction.editReply({ content: 'Подтверждение не получено в течение 1 минуты, отмена', components: [row2] });
            }
        

            





                    }
}


