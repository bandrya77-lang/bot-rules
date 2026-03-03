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


    await interaction.deferReply({ ephemeral: false }).catch((err) => null);
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('rules')
          .setPlaceholder(config.cmd_description)
          .addOptions(selecttest.map(e => {
            return {
              ...e
            }
          })),
      );
    
    await interaction.editReply({ content: config.cmdTitle, ephemeral: true, components: [row] })
  }
  if (interaction.isStringSelectMenu()) {
    const choice = interaction.values[0];
    const selectedElement = selecttest.find(element => choice === element.value);

    if (selectedElement) {
      await interaction.deferReply({ ephemeral: false });
      await interaction.editReply({ content: `${selectedElement.emoji} ${selectedElement.label} \n ${selectedElement.message}`, ephemeral: true });
    }
  }
});
client.login(process.env.TOKEN);
