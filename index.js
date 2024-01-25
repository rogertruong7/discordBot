import dotenv from "dotenv";
dotenv.config();

import { 
    Client, 
    GatewayIntentBits,
    IntentsBitField,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle, 
} from "discord.js";

// const express = require("express");
// const app = express();

// app.listen(3000, () => {
//   console.log("Hello World");
// });

// app.get("/", (req, res) => {
//   res.send("Hello LOLL");
// });

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ],
});

client.login(process.env.DISCORD_TOKEN);

/////////////////////////////////////////////////////////
client.on("messageCreate", async (message) => {

    if (!message?.author.bot) {
        message.channel.send(`I am copying you: ${message.content}`);
    }   

});
