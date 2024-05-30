const { SlashCommandBuilder } = require('discord.js')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-create')
        .setDescription('Занести роль в бд')
        .addRoleOption(option => 
            option.setName('role')
            .setDescription('Название роли')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('tag')
            .setDescription('Тег для роли')
            .setRequired(true)),

        async execute(interaction) {
            const role = interaction.options.getRole('role');
            const roleId = role.id;
            const tag = interaction.options.getString('tag');

            const roles = await prisma.roles.upsert({
                where: {
                    idRole: roleId
                },
                update: {
                    idRole: roleId,
                    tag: tag 
                },
                create: {
                    idRole: roleId,
                    tag: tag 
                },
              }).catch(console.error)

            await interaction.reply(`Роль ${role} была обновлена и имеет тег ${tag}, для запроса на выдачу орг. роли.`)
            
        }
}