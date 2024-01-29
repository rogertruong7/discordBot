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
const { blackjack, blackjackCont } = require("../commands/blackjack.js");

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
    name: "PREFIX IS !",
    type: ActivityType.Custom,
  });
});

// gotta have to put these in a database
let flag = 1;
let chosenCards = [];
let namedCards = [];
let dealerPoints = 0;
let playerPoints = 0;

client.on("messageCreate", async (message) => {
  const messageReceived = message.content.toLowerCase();
  if (!message?.author.bot && messageReceived.includes("oh no")) {
    message.channel.send({
      content: `Oh no! Oh no! I'm the Biggest Bird :musical_note: I'm the Biggest Bird :musical_note:`
    }
    );
  }

  // Commands
  if (!message?.author.bot && message.content.startsWith(prefix)) {
    const length = prefix.length;
    const command = message.content.slice(length);
    if (command !== "blackjack" && command !== "help") return;

    //maybe when i hv database do in_game_flag

    if (command === "help") {
      help(message);
    } else if (command === "blackjack" && flag === 1) {
      flag = 0;
      const result = blackjack(message);
      setTimeout(() => {
        flag = 1;
      }, 60000);
      flag = result.flag;
      chosenCards = result.chosenCards;
      namedCards = result.namedCards;
      playerPoints = result.playerPoints;
      dealerPoints = result.dealerPoints;
    } else if (flag === 0) {
      message.channel.send(`You are already in a game.`);
      return;
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  
  // Blackjack Buttons
  if (
    interaction.isButton() &&
    (interaction.customId === "hit" + interaction.user.id ||
      interaction.customId === "stand" + interaction.user.id)
  ) {
    flag = 0;
    console.log("interaction custom id = " + interaction.customId);
    console.log(interaction);
    console.log(
      `This is the result\n chosen cards = ${chosenCards}, named cards = ${namedCards}`
    );
      
    result = blackjackCont(
      interaction,
      chosenCards,
      namedCards,
      dealerPoints,
      playerPoints
    );
    flag = result.flag;
    chosenCards = result.chosenCards;
    namedCards = result.namedCards;
    dealerPoints = result.dealerPoints;
    playerPoints = result.playerPoints;
  }
});
