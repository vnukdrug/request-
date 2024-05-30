const { Client, GatewayIntentBits, EmbedBuilder, Events, MessageManager, Portials, PermissionsBitField, Embed, Collection, ChannelType, Permissions, GuildMember, GuildHubType, AuditLogEvent, ButtonBuilder, ActionRowBuilder, DMChannel, InteractionCollector, Partials, ButtonStyle, ActivityType, Intents, ModalBuilder, TextInputBuilder, TextInputStyle } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates], partials: Object.values(Partials), }); 
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

for (const file of functions) {
      require(`./functions/${file}`)(client);
    }

client.handleEvents(eventFiles, "./src/events");
client.handleCommands(commandFolders, "./src/commands");
client.login(process.env.token);

const Requests = {}

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const { customId } = interaction;


    if (customId === 'zapros') {

        await interaction.deferReply({ fetchReply: true, ephemeral: true })

        const tagPattern = /\[(.*?)\]/;
        const match = interaction.member.displayName.match(tagPattern);
        if (!match) {
            await interaction.editReply({ content: 'Для выполнения этого действия ваш никнейм должен содержать тег в квадратных скобках, например [LSPD].', ephemeral: true });
            return;
        }
        const tag = match[1];
        const role = await prisma.roles.findFirst({
            where: {
                tag: tag
            }
        });
        const roleId = role.idRole;

        if (interaction.member.roles.cache.has(roleId)) {
            await interaction.editReply({ content: `У вас уже есть роль <@&${roleId}>, вы не можете подать заявку.`, ephemeral: true });
            return;
        }

        const allRoles = await prisma.roles.findMany();
        const userRoles = interaction.member.roles.cache.map(role => role.id);
        const hasAnyRole = allRoles.some(role => userRoles.includes(role.idRole));

        if (hasAnyRole) {
            await interaction.editReply({ content: `У вас уже есть активная роль, вы не можете подать заявку на новую роль.`, ephemeral: true });
            return;
        }
  
        if (!role) {
            await interaction.editReply({ content: `У вас неверный формат тега. Нажмите на кнопку "Список доступных тегов", что-бы узнать список доступных тегов.`, ephemeral: true });
            return;
        }

        const channel1 = await client.channels.fetch(process.env.channel);

        const messages = await channel1.messages.fetch({ limit: 100 });
        const userIdMention = `<@${interaction.user.id}>`; // Форматируем ID пользователя как упоминание
        const existingRequest = messages.find(m => 
            m.embeds.length > 0 && 
            m.embeds[0].fields.some(f => f.name === 'Аккаунт' && f.value.includes(userIdMention))
        );
    
        if (existingRequest) {
            const requestTime = existingRequest.createdAt;
            const errorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Ошибка: Повторный запрос на роль')
                .setDescription(`Вы уже отправили запрос на роль. Пожалуйста, дождитесь рассмотрения вашего предыдущего запроса.`)
                .addFields(
                    { name: 'Время вашего запроса', value: `${requestTime.toLocaleString('ru-RU')}`, inline: false }
                )
                .setTimestamp();
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        const accept = new ButtonBuilder()
            .setCustomId('accept')
            .setLabel('Принять')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success)
        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Отказать в выдачи роли')
            .setEmoji('🛑')
            .setStyle(ButtonStyle.Danger)
        const request = new ButtonBuilder()
            .setCustomId('request')
            .setLabel('Запросить статистику')
            .setEmoji('🫡')
            .setStyle(ButtonStyle.Secondary)
        const del = new ButtonBuilder()
            .setCustomId('del')
            .setLabel('Удалить запрос')
            .setEmoji('🍺')
            .setStyle(ButtonStyle.Primary)

        const rowButtons = new ActionRowBuilder().addComponents(accept, cancel)
        const rowButtons2 = new ActionRowBuilder().addComponents(request, del)
        
        const zaprosrole = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Discord > Запрос о выдаче роли организации.')
        .addFields(
            { name: 'Аккаунт', value: `${interaction.member}` },
            { name: 'Никнейм', value: `${interaction.member.displayName}` },
            { name: 'Роль для выдачи', value: `<@&${roleId}>`, inline: true }
        )
        const channel = await client.channels.fetch(process.env.channel);
        await channel.send({ embeds: [zaprosrole], components: [rowButtons, rowButtons2] });
  
        await interaction.editReply({ content: '📨 Ваш запрос на получение роли был отправлен!', ephemeral: true });




    } else if (customId === 'forma') {
        await interaction.reply({ content: 'Для получения роли, ваш ник должен быть в формате [фракция] Ваш_Ник [ранг].', ephemeral: true });
    } else if (customId === 'tegi') {
        const roles = await prisma.roles.findMany({
            select: {
                tag: true,
                idRole: true
            }
          });

          let messageContent = '';
          roles.forEach((role, index) => {
              messageContent += `${index + 1}. [${role.tag}] => <@&${role.idRole}>\n`;
          });

          const embed = new EmbedBuilder()
          .setColor('#ffa000')
          .setAuthor({ name: 'Теги организаций', iconURL: interaction.guild.iconURL() })
          .setDescription(messageContent)
              await interaction.reply({ embeds: [embed], ephemeral: true });
    }
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    switch (customId) {
        case 'accept':
            await interaction.message.delete()
            const embed = interaction.message.embeds[0];
            let accountIdField = embed.fields.find(field => field.name === 'Аккаунт');
            let accountId = accountIdField.value.match(/<@(\d+)>/)[1];
            let roleIdField = embed.fields.find(field => field.name === 'Роль для выдачи');
            let roleId = roleIdField.value.match(/<@&(\d+)>/)[1];
            const role = await interaction.guild.roles.fetch(roleId);
            const roleName = role ? role.name : 'Неизвестная роль';
            await interaction.channel.send({ content: `\`[DEBUG] Запрос на выдачу роли ${roleName} пользователя \`<@${accountId}>\`(\` \`ID:\` ||${accountId}|| \`)\` \`был рассмотрен и одобрен модератором \`${interaction.member}.` })
            const member = await interaction.guild.members.fetch(accountId);
            await member.roles.add(roleId);
            await member.send({ content: `[Payson] Модератор ${interaction.member} одобрил ваш запрос на выдачу роли **${roleName}**!`})
            break;
        case 'cancel':
            await interaction.message.delete()
            const embed2 = interaction.message.embeds[0];
            let accountIdField2 = embed2.fields.find(field => field.name === 'Аккаунт');
            let accountId2 = accountIdField2.value.match(/<@(\d+)>/)[1];
            let roleIdField2 = embed2.fields.find(field => field.name === 'Роль для выдачи');
            let roleId2 = roleIdField2.value.match(/<@&(\d+)>/)[1];
            const role2 = await interaction.guild.roles.fetch(roleId2);
            const roleName2 = role2 ? role2.name : 'Неизвестная роль';
            await interaction.channel.send({ content: `\`[DEBUG] Запрос на выдачу роли ${roleName2} пользователя \`<@${accountId2}> \`(\` \`ID:\` ||${accountId2}|| \`)\` \`был рассмотрен и отказан модератором \`${interaction.member}.` })
            const member2 = await interaction.guild.members.fetch(accountId2);
            await member2.send({ content: `[Payson] Модератор ${interaction.member} отклонил ваш запрос на выдачу роли.\nВаш ник при отправке: **${member2.displayName}**. Установите форму ника на: **[фракция] Nick_Name [ранг]**`})
            break;
        case 'request':
            await interaction.message.delete()
            const embed3 = interaction.message.embeds[0];
            let accountIdField3 = embed3.fields.find(field => field.name === 'Аккаунт');
            let accountId3 = accountIdField3.value.match(/<@(\d+)>/)[1];
            let roleIdField3 = embed3.fields.find(field => field.name === 'Роль для выдачи');
            let roleId3 = roleIdField3.value.match(/<@&(\d+)>/)[1];
            const role3 = await interaction.guild.roles.fetch(roleId3);
            const roleName3 = role3 ? role3.name : 'Неизвестная роль'; 
            await interaction.channel.send({ content: `\`[DEBUG] \`${interaction.member}\`, запросил статистику у \`<@${accountId3}>\`, с ID: \` ||${accountId3}||` })
            const member3 = await interaction.guild.members.fetch(accountId3);
            await member3.send({ content: `[Payson] Модератор ${interaction.member} запросил статистику на запрос на выдачу роли.\nВаш ник при отправке: **${member3.displayName}**`})
            break;
        case 'del':
            await interaction.message.delete()
            const embed4 = interaction.message.embeds[0];
            let accountIdField4 = embed4.fields.find(field => field.name === 'Аккаунт');
            let accountId4 = accountIdField4.value.match(/<@(\d+)>/)[1];
            let roleIdField4 = embed4.fields.find(field => field.name === 'Роль для выдачи');
            let roleId4 = roleIdField4.value.match(/<@&(\d+)>/)[1];
            const role4 = await interaction.guild.roles.fetch(roleId4);
            const roleName4 = role4 ? role4.name : 'Неизвестная роль'; 
            await interaction.channel.send({ content: `\`[DEBUG] \`${interaction.member}\`, удалил запрос от \`<@${accountId4}>\`, с ID: \` ||${accountId4}||` })
            break;
    }
});


// Анти-краш вашей системы, не убирайте иначе при любой ошибке бот будет выключаться.

process.on('unhandledRejection', async (reason, promise) => {
    console.log('Неизвестная ошибка:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.log('Неизвестная ошибка:', err);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('Неизвестная ошибка', err, origin);
});