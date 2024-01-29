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
  Events,
  ActionRowBuilder,
} = require("discord.js");

const cardPoints = [
  11, 11, 11, 11, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7,
  7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10, 10, 10, 10, 10,
];

const buttonWrapper = require("../src/button-wrapper");

const buttonData = [
  {
    message: "HIT",
  },
  {
    message: "STAND",
  },
];

function getRandomNumber(chosenCards) {
  let value = Math.floor(Math.random() * 52);
  while (chosenCards.includes(value)) {
    value = Math.floor(Math.random() * 52);
  }
  chosenCards.push(value);
  return {
    value,
    chosenCards,
  };
}

function exitSoon(message) {
  message.channel.send(
    "If you do not choose an option, you will automatically lose in 15 seconds."
  );
}
function exit(message) {
  message.channel.send("Time has run out. You lost the game.");
}

function cardConversion(namedCards, card) {
  card += 1;
  let suit = card % 4;
  let number = Math.ceil(card / 4);
  if (number === 1) {
    number = "Ace";
  }
  if (number === 11) {
    number = "Jack";
  }
  if (number === 12) {
    number = "Queen";
  }
  if (number === 13) {
    number = "King";
  }
  if (suit === 0) {
    namedCards.push(number + " of Hearts :heart:");
  } else if (suit === 1) {
    namedCards.push(number + " of Spades :spades:");
  } else if (suit === 2) {
    namedCards.push(number + " of Diamonds :diamonds:");
  } else if (suit === 3) {
    namedCards.push(number + " of Clubs :clubs:");
  }
  return namedCards;
}

// Face cards each count as 10, Aces count as 1 or 11, all others count at face value. An Ace with any 10, Jack, Queen, or King is a “Blackjack.”
function blackjack(message) {
  //   return new Promise(async (resolve, reject) => {
  //     const fiftenTimeout = setTimeout(() => {
  //       exitSoon(message);
  //     }, 15000);
  //     const exitMessageTimeOut = setTimeout(() => {
  //       exit(message);
  //     }, 30000);
  //     const exitTimeOut = setTimeout(() => {
  //       resolve(1);
  //     }, 30000);

  let chosenCards = [];
  const card1 = getRandomNumber(chosenCards);
  chosenCards = card1.chosenCards;
  const card2 = getRandomNumber(chosenCards);
  chosenCards = card2.chosenCards;
  const card3 = getRandomNumber(chosenCards);
  chosenCards = card3.chosenCards;
  const card4 = getRandomNumber(chosenCards);
  chosenCards = card4.chosenCards;
  console.log(
    `Chosen card numbers: ${card1.value}, ${card2.value} , ${card3.value}, ${card4.value}`
  );
  let namedCards = [];
  for (card of chosenCards) {
    namedCards = cardConversion(namedCards, card);
  }

  let playerPoints = cardPoints[card1.value] + cardPoints[card3.value];
  if (
    playerPoints > 21 &&
    cardPoints[card1.value] === 11 &&
    cardPoints[card3.value] === 11
  ) {
    playerPoints -= 10;
  }
  let dealerPoints = cardPoints[card2.value];
  let hiddenDealerPoints = cardPoints[card2.value] + cardPoints[card4.value];
  if (
    hiddenDealerPoints > 21 &&
    cardPoints[card2.value] === 11 &&
    cardPoints[card4.value] === 11
  ) {
    hiddenDealerPoints -= 10;
  }

  let bottomText = "Choose to either **HIT** or **STAND**";
  if (playerPoints === 21) {
    bottomText = "**Blackjack! You win!**";
  }

  console.log(message.author.id);

  let blackjackEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("Blackjack")
    //.setDescription("Some description here")
    .setThumbnail(
      "https://static.wikia.nocookie.net/nicos-nextbots-fanmade/images/b/bd/Bigbird.png/revision/latest?cb=20230225202734"
    )
    .addFields(
      {
        name: `Dealer cards:\n• ${namedCards[1]}\n• **UNKNOWN**`,
        value: `Score: **${dealerPoints}**`,
        inline: false,
      },
      {
        name: `Your cards:\n• ${namedCards[0]}\n• ${namedCards[2]}`,
        value: `Score: **${playerPoints}**`,
        inline: false,
      },
      {
        name: "\u200b",
        value: bottomText,
        inline: false,
      }
    );
  const hitButton = new ButtonBuilder()
    .setCustomId(`hit` + message.author.id) // set the id of the button to contain the message holder's id so when the iteraction is used it can check if the right person is clicking 5HEAD
    .setLabel("HIT")
    .setStyle(ButtonStyle.Primary);

  const standButton = new ButtonBuilder()
    .setCustomId(`stand` + message.author.id) // set the id of the button to contain the message holder's id so when the iteraction is used it can check if the right person is clicking 5HEAD
    .setLabel("STAND")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(hitButton, standButton);
  const messageObject = {
    components: [row],
  };

  message.channel.send({ embeds: [blackjackEmbed], ephemeral: true });

  if (playerPoints === 21) {
    return {
      flag: 1,
      chosenCards: [],
      namedCards: [],
      dealerPoints: 0,
      playerPoints: 0,
    };
  }

  message.channel.send(messageObject);
  return {
    flag: 0,
    chosenCards: chosenCards,
    namedCards: namedCards,
    dealerPoints: hiddenDealerPoints,
    playerPoints: playerPoints,
  };
}

function blackjackCont(
  interaction,
  chosenCards,
  namedCards,
  dealerPoints,
  playerPoints
) {
    
    interaction.channel.lastMessage.delete();
  const result = getRandomNumber(chosenCards);
  card = result.value;
  chosenCards = result.chosenCards;
  console.log(chosenCards);
  points = cardPoints[card];
  namedCards = cardConversion(namedCards, card);
  console.log(`new points = ${points}`);
  console.log(namedCards);

  //  The Dealer must draw on 16 or less, and stand on 17 or more

  if (interaction.customId === "hit" + interaction.user.id) {
    playerPoints = playerPoints + points;
    const cardAmount = namedCards.length;
    let totalPlayerPoints =
      cardPoints[chosenCards[0]] + cardPoints[chosenCards[2]];
    let aceCount = 0;
    let yourString = `Your cards: \n• ${namedCards[0]}\n• ${namedCards[2]}`;
    let hiddenDealerPoints = dealerPoints - cardPoints[chosenCards[3]];
    let dealerString = `Dealer cards: \n• ${namedCards[1]} \n• **UNKNOWN**`;

    for (let i = 4; i < cardAmount; i++) {
      totalPlayerPoints += cardPoints[chosenCards[i]];
      if (namedCards[i].includes("Ace")) {
        aceCount++;
      }
      yourString = yourString + `\n• ${namedCards[i]}`;
    }

    if (namedCards[0].includes("Ace")) {
      aceCount++;
    }
    if (namedCards[2].includes("Ace")) {
      aceCount++;
    }
    console.log(totalPlayerPoints);
    console.log(aceCount);

    if (playerPoints > 21) {
      if (aceCount >= 1 && totalPlayerPoints - aceCount * 10 <= 21) {
        playerPoints -= 10;
      }
    }

    let bottomText = "Choose to either **HIT** or **STAND**";
    if (playerPoints === 21) {
      bottomText = "**Blackjack! You win!**";
      dealerString = `Dealer cards: \n• ${namedCards[1]} \n• ${namedCards[3]}`;
      hiddenDealerPoints = dealerPoints;
    } else if (playerPoints > 21) {
      bottomText = "**You lose! Dealer wins!**";
      dealerString = `Dealer cards: \n• ${namedCards[1]} \n• ${namedCards[3]}`;
      hiddenDealerPoints = dealerPoints;
    }

    let blackjackEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Blackjack")
      .setThumbnail(
        "https://static.wikia.nocookie.net/nicos-nextbots-fanmade/images/b/bd/Bigbird.png/revision/latest?cb=20230225202734"
      )
      .addFields(
        {
          name: dealerString,
          value: `Score: **${hiddenDealerPoints}**`,
          inline: false,
        },
        {
          name: yourString,
          value: `Score: **${playerPoints}**`,
          inline: false,
        },
        {
          name: "\u200b",
          value: bottomText,
          inline: false,
        }
      );
    interaction.reply({ embeds: [blackjackEmbed] });
    const hitButton = new ButtonBuilder()
      .setCustomId(`hit` + interaction.user.id) // set the id of the button to contain the message holder's id so when the iteraction is used it can check if the right person is clicking 5HEAD
      .setLabel("HIT")
      .setStyle(ButtonStyle.Primary);

    const standButton = new ButtonBuilder()
      .setCustomId(`stand` + interaction.user.id) // set the id of the button to contain the message holder's id so when the iteraction is used it can check if the right person is clicking 5HEAD
      .setLabel("STAND")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(hitButton, standButton);
    const messageObject = {
      components: [row],
    };
    if (bottomText === "Choose to either **HIT** or **STAND**") {
      setTimeout(() => {
        interaction.channel.send(messageObject);
      }, 500);
      return {
        flag: 0,
        chosenCards: chosenCards,
        namedCards: namedCards,
        dealerPoints: dealerPoints,
        playerPoints: playerPoints,
      };
    } else {
      return {
        flag: 1,
        chosenCards: [],
        namedCards: [],
        dealerPoints: 0,
        playerPoints: 0,
      };
    }
  } else if (interaction.customId === "stand" + interaction.user.id) {
    // while (dealerPoints <= 16) {

    // }
    interaction.reply("what");
    return {
      flag: 1,
    };
  }
  // if (win) {
  //     return {
  //         flag: 1
  //     }
  // }
  return {
    flag: 1,
    chosenCards: [],
    namedCards: [],
    dealerPoints: 0,
    playerPoints: 0,
  };
}

module.exports = { blackjack, blackjackCont };
