// File structure:
/*
discord-bot/
  ├── index.js
  ├── commands/
  │   ├── ping.js
  │   └── help.js
  ├── config.json
  └── package.json
*/

// First, run these commands in terminal:
// mkdir discord-bot
// cd discord-bot
// npm init -y
// npm install discord.js dotenv

// In index.js:
require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

// Create .env file in root directory:
// DISCORD_TOKEN=your_bot_token_here

client.login(process.env.DISCORD_TOKEN);

// In commands/ping.js:


// In commands/help.js:


// To run the bot:
// node index.js

// Before running, make sure to:
// 1. Create a new application at https://discord.com/developers/applications
// 2. Create a bot for your application
// 3. Get the bot token and add it to .env file
// 4. Enable necessary intents in the Discord Developer Portal
// 5. Generate invite link with proper permissions
// 6. Invite the bot to your server
