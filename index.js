const Discord = require("discord.js")
const { Client, GatewayIntentBits, DiscordAPIError, ChannelType, CategoryChannel, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const config = require("./config.json")
const selecttest = require("./rules.json")

const { REST, Routes } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ModalBuilder, MessageEmbed, MessageAttachment, StringSelectMenuBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions
  ],
});
require('dotenv').config()
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
})
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(config.ID_Bot_Discord), {
      body: [

        {
          name: config.cmdRules,
          description: config.cmd_description,
        },
      ]
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async (interaction) => {
 if (interaction.commandName === 'rules') {

  await interaction.deferReply({ ephemeral: false }).catch(() => null);

  const embed = new EmbedBuilder()
    .setTitle("📜 القوانين")
    .setDescription("اختر من القائمة بالأسفل")
    .setImage("https://cdn.discordapp.com/attachments/1288579286600515626/1478807328835768432/3fa07620-f1d2-44fb-92c6-b9f4a811b402.jpg?ex=69a9be26&is=69a86ca6&hm=58074c1fba1257b6934a9f9f43cee6e57e54fa1c9d563d54f07c790cd6ec6241&")
    .setColor("#2b2d31");

  const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('rules')
        .setPlaceholder(config.cmd_description)
        .addOptions(selecttest.map(e => ({ ...e })))
    );

  await interaction.editReply({
    embeds: [embed],
    components: [row]
  });

}
  if (interaction.isStringSelectMenu()) {
    const choice = interaction.values[0];
    const selectedElement = selecttest.find(element => choice === element.value);

    if (selectedElement) {
      await interaction.deferReply({ ephemeral: true });
 const embed = new EmbedBuilder()
  .setTitle(`${selectedElement.emoji} ${selectedElement.label}`)
  .setDescription(selectedElement.message)
  .setImage(selectedElement.image)
  .setColor("#2b2d31");

await interaction.editReply({
  embeds: [embed]
});
    }
  }
});
client.login(process.env.TOKEN);
