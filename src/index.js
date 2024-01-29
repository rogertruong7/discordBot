require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  IntentsBitField,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActivityType,
  EmbedBuilder,
} = require("discord.js");

const help = require("../commands/help.js");
const blackjack = require("../commands/blackjack.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ],
});

let prefix = "!";

client.login(process.env.DISCORD_TOKEN);

/////////////////////////////////////////////////////////
client.on("ready", () => {
  console.log(`I'm online!`);
  client.user.setActivity({
    name: "I'm the Biggest Bird 🦅",
    type: ActivityType.Custom,
  });
});

let flag = 1;

client.on("messageCreate", async (message) => {
  const messageReceived = message.content.toLowerCase();
  if (!message?.author.bot && messageReceived.includes("oh no")) {
    message.channel.send(
      `Oh no! Oh no! I'm the Biggest Bird :musical_note: I'm the Biggest Bird :musical_note:`
    );
  }

  // Commands
  if (!(message?.author.bot) && message.content.startsWith(prefix) && flag === 1) {
    flag = 0;
    const command = message.content.slice(1);
    if (command === "help") {
      help(message);
      flag = 1;
    } else if (command === "blackjack") {
      
      flag = await blackjack(message);
      
    }
  } else if (
    !message?.author.bot &&
    message.content.startsWith(prefix) &&
    flag === 0
  ) {
    message.channel.send(
      `You are already in a game.`
    );
    return;
  };
});
