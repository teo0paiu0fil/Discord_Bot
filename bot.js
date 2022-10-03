const { Client, Intents, Collection} = require("discord.js");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]
    });

require('dotenv').config();

const fs = require("fs");

const { default: mongoose } = require("mongoose");

const { env } = require("process");
client.commands = new Collection;

const prefix = process.env.PREFIX;
const botchannel = process.env.NEWS;
const MANGO = process.env.DATABASE;

const commands = fs.readdirSync("./Commands").filter(file => file.endsWith(".js"));
for (let i = 0; i < commands.length; i++) {
    const commandName = commands[i].split(".")[0];
    const command = require(`./Commands/${commandName}`);
    client.commands.set(commandName, command);
}

client.on('ready', async () => {
    console.log('Running...');
    await mongoose.connect(MANGO, {
        keepAlive: true
    }).then(console.log("Conected to Database..."));

    const news = client.commands.get('news');
    const message = client.channels.cache.get(botchannel);
    setInterval( () => {
        console.log("Fetching data");
        news.run(client, message, mongoose);
    }, 30 * 60 * 1000);
});

client.on('messageCreate', (message) => {
    if(message.content.startsWith(prefix)) {
        const args = message.content.split(' ');
        const commandName = args[0].substr(1, args[0].length);
        const command = client.commands.get(commandName);
        if (!command) return;
        command.run(client, message, args);
    }
});

client.login(process.env.TOKEN);