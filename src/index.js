import dotenv from "dotenv";
dotenv.config();

import { generate, count } from "random-words";
import {
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
  Events,
  ActionRowBuilder,
} from "discord.js";

import help from "../commands/help.js";
import { blackjack, blackjackCont } from "../commands/blackjack.js";

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
    name: "!help",
    type: ActivityType.Listening,
  });
});

// gotta have to put these in a database
let flag = 1;
let chosenCards = [];
let namedCards = [];
let dealerPoints = 0;
let playerPoints = 0;
let playerWord = "dw1ioe1qwa213djawjqewq1daw";
let player1 = 0;
let player2 = 0;

client.on("messageCreate", async (message) => {
  const messageReceived = message.content.toLowerCase();
  if (!message?.author.bot && messageReceived.includes("oh no")) {
    message.channel.send({
      content: `Oh no! Oh no! I'm the Biggest Bird :musical_note: I'm the Biggest Bird :musical_note:`,
    });
  }
  if (!message?.author.bot && (message.author === player1 || message.author === player2) && messageReceived.includes(playerWord)) {
    message.channel.send(`${message.author} won!`);
    playerWord = "dwioadjawjdaw";
  }

  // Commands
  if (!message?.author.bot && message.content.startsWith(prefix)) {
    const length = prefix.length;
    let words = message.content.split(" ");
    console.log(words);
    const command1 = words[0];
    const command = command1.slice(length);
    if (command !== "blackjack" && command !== "help" && command !== "gunfight" && command !== 'exit')
      return;

    //maybe when i hv database do in_game_flag

    if (command === "help") {
      help(message);
    } 
    else if (command === "exit") {
      flag = 1;
      chosenCards = [];
      namedCards = [];
      dealerPoints = 0;
      playerPoints = 0;
      message.channel.send("You have exited the game and surrendered your money.")
    }
    else if (command === "blackjack" && flag === 1) {
      flag = 0;
      const result = blackjack(message, chosenCards, namedCards);
      setTimeout(() => {
        flag = 1;
      }, 30000);
      flag = result.flag;
      chosenCards = result.chosenCards;
      namedCards = result.namedCards;
      playerPoints = result.playerPoints;
      dealerPoints = result.dealerPoints;
    } 
    else if (command === "gunfight") {
      console.log("Hello World");
      player2 = message.mentions.users.first();
      player1 = message.author;
      console.log(player2);

      playerWord = generate({ minLength: 3 });
      console.log(playerWord);
      message.channel.send(
        "Type the following word as quickly as possible. It will appear in 3 seconds."
      );
      setTimeout(() => {
        message.channel.send("3");
      }, 500);
      setTimeout(() => {
        message.channel.send("2");
      }, 1500);
      setTimeout(() => {
        message.channel.send("1");
      }, 2500);
      setTimeout(() => {
        message.channel.send(`Your gunfight word is **${playerWord}**`);
      }, 3500);
    } 
    else if (flag === 0) {
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

    let lastMessages = await interaction.channel.messages.fetch({
      limit: 10,
    });
    // If the component section of the message is > 0 i.e. a button
    const button = lastMessages.find((item) => item.components.length !== 0);
    // We delete said button
    if (button) {
      button.delete();
    }
    
    flag = 0;
    setTimeout(() => {
      flag = 1;
    }, 30000);
    const result = blackjackCont(
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
