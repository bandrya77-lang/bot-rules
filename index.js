const { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  ActionRowBuilder, 
  StringSelectMenuBuilder 
} = require('discord.js');

require('dotenv').config();

const config = require("./config.json");
const selecttest = require("./rules.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(config.ID_Bot_Discord),
      {
        body: [
          {
            name: "rules",
            description: config.cmd_description,
          },
        ],
      }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async (interaction) => {

  // لما يكتب /rules
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "rules") {

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('rules')
          .setPlaceholder(config.cmd_description)
          .addOptions(selecttest)
      );

      await interaction.reply({
        content: config.cmdTitle,
        ephemeral: true,
        components: [row],
      });
    }
  }

  // لما يختار من القائمة
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === "rules") {

      const choice = interaction.values[0];
      const selectedElement = selecttest.find(e => e.value === choice);

      if (selectedElement) {
        await interaction.update({
          content: ${selectedElement.emoji} ${selectedElement.label}\n${selectedElement.message},
          components: [],
        });
      }
    }
  }
});

client.login(process.env.TOKEN);
