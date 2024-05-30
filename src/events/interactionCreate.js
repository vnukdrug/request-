const { Interaction } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return
        
        try{


            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: `Произошла ошибка! Свяжитесь с разработчиком <@523167219513950210> для того что-бы решить проблему! \n\ \`\`\`${error}\`\`\``, 
                ephemeral: true
            });
        } 

    },
};