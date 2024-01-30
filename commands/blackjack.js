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

const loseString = "**You lose! DEALER WINS!**";
const winString = "**PLAYER WINS!**";

let blackjackEmbed = {
  color: 0x0099ff,
  title: "Blackjack",
  thumbnail: {
    url: "https://static.wikia.nocookie.net/nicos-nextbots-fanmade/images/b/bd/Bigbird.png/revision/latest?cb=20230225202734",
  },
  fields: [
    {
      name: "\u200b",
      value: "\u200b",
      inline: false,
    },
    {
      name: "\u200b",
      value: "\u200b",
      inline: false,
    },
    {
      name: "\u200b",
      value: "\u200b",
      inline: false,
    },
  ],
};

const cardPoints = [
  11, 11, 11, 11, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7,
  7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  10, 10, 10, 10, 10,
];

// Code gets a random number between 0 and 52. If it
// has already been picked it is pushed to chosenCards array
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

// Names cards i.e. if card is 41 it will become Jack of Spades
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
    namedCards.push(number + " of Hearts ♥️");
  } else if (suit === 1) {
    namedCards.push(number + " of Spades ♠️");
  } else if (suit === 2) {
    namedCards.push(number + " of Diamonds ♦️");
  } else if (suit === 3) {
    namedCards.push(number + " of Clubs ♣️");
  }
  return namedCards;
}

// Function which first draws 4 cards
export function blackjack(message, chosenCards, namedCards) {
  const card1 = getRandomNumber(chosenCards);
  chosenCards = card1.chosenCards;
  const card2 = getRandomNumber(chosenCards);
  chosenCards = card2.chosenCards;
  const card3 = getRandomNumber(chosenCards);
  chosenCards = card3.chosenCards;
  const card4 = getRandomNumber(chosenCards);
  chosenCards = card4.chosenCards;

  // Converts into named versions of cards
  for (const card of chosenCards) {
    namedCards = cardConversion(namedCards, card);
  }

  // Calculate the points of the cards
  let playerPoints = cardPoints[card1.value] + cardPoints[card3.value];
  // If two aces are drawn, then the points will equal to 22
  // The rules state an Ace will be worth 1 if the total score is above 21
  if (
    playerPoints > 21 &&
    cardPoints[card1.value] === 11 &&
    cardPoints[card3.value] === 11
  ) {
    playerPoints -= 10;
  }

  // Dealer Points are the same. Only one card is shown until standing.
  let dealerPoints = cardPoints[card2.value];
  let hiddenDealerPoints = cardPoints[card2.value] + cardPoints[card4.value];
  if (
    hiddenDealerPoints > 21 &&
    cardPoints[card2.value] === 11 &&
    cardPoints[card4.value] === 11
  ) {
    hiddenDealerPoints -= 10;
  }

  // Creating strings to be entered into the embed
  let dealerString = `Dealer cards:\n• ${namedCards[1]}\n• **UNKNOWN**`;
  let bottomText = "Choose to either **HIT** or **STAND**";
  if (playerPoints === 21) {
    bottomText = "**Blackjack!** " + winString;
    dealerString = `Dealer cards: \n• ${namedCards[1]} \n• ${namedCards[3]}`;
  }

  // Changing Embed Fields
  blackjackEmbed.fields[0] = {
    name: dealerString,
    value: `Score: **${dealerPoints}**`,
  };
  blackjackEmbed.fields[1] = {
    name: `Your cards:\n• ${namedCards[0]}\n• ${namedCards[2]}`,
    value: `Score: **${playerPoints}**`,
  };
  blackjackEmbed.fields[2].value = bottomText;

  // Creating Buttons
  // We set the id of the button to contain the message holder's id so when the iteraction is used it can check if the right person is clicking.
  const hitButton = new ButtonBuilder()
    .setCustomId(`hit` + message.author.id)
    .setLabel("HIT")
    .setStyle(ButtonStyle.Primary);

  const standButton = new ButtonBuilder()
    .setCustomId(`stand` + message.author.id)
    .setLabel("STAND")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(hitButton, standButton);
  const messageObject = {
    components: [row],
  };

  // Sending the embed
  message.channel.send({ embeds: [blackjackEmbed] });

  // Ending the game early and resetting the values of points and arrays and flag
  if (playerPoints === 21) {
    return {
      flag: 1,
      chosenCards: [],
      namedCards: [],
      dealerPoints: 0,
      playerPoints: 0,
    };
  }
  // Sending the buttons
  message.channel.send(messageObject);

  // Return object with values needed for button interaction
  return {
    flag: 0,
    chosenCards: chosenCards,
    namedCards: namedCards,
    dealerPoints: hiddenDealerPoints,
    playerPoints: playerPoints,
  };
}

// Hit and Stand Function for Blackjack
export function blackjackCont(
  interaction,
  chosenCards,
  namedCards,
  dealerPoints,
  playerPoints
) {
  // Drawing a card
  const result = getRandomNumber(chosenCards);
  const card = result.value;
  chosenCards = result.chosenCards;
  const points = cardPoints[card];
  namedCards = cardConversion(namedCards, card);

  // If statement for hit/stand
  if (interaction.customId === "hit" + interaction.user.id) {
    // Calculating new player points
    playerPoints = playerPoints + points;
    const cardAmount = namedCards.length;

    // Creating the strings for the embed
    let yourString = `Your cards: \n• ${namedCards[0]}\n• ${namedCards[2]}`;
    let hiddenDealerPoints = dealerPoints - cardPoints[chosenCards[3]];
    let dealerString = `Dealer cards: \n• ${namedCards[1]} \n• **UNKNOWN**`;

    // If an amount is added to a hand with an Ace in it
    // and the amount is more than 21, it will make the Ace go from
    // 11 to 1 points. This also applies when the Ace is drawn
    // To attend to this we calculate the total player points and the amount of
    // aces to see make sure an ace's value is only changed once
    let totalPlayerPoints =
      cardPoints[chosenCards[0]] + cardPoints[chosenCards[2]];

    // Ace Count
    let aceCount = 0;
    if (namedCards[0].includes("Ace")) {
      aceCount++;
    }
    if (namedCards[2].includes("Ace")) {
      aceCount++;
    }
    // Loop through player cards to look for aces and count points
    for (let i = 4; i < cardAmount; i++) {
      totalPlayerPoints += cardPoints[chosenCards[i]];
      if (namedCards[i].includes("Ace")) {
        aceCount++;
      }
      // Adding all drawn cards to the string
      yourString = yourString + `\n• ${namedCards[i]}`;
    }

    // Maths to change Ace value
    if (playerPoints > 21) {
      if (aceCount >= 1 && totalPlayerPoints - aceCount * 10 <= 21) {
        playerPoints -= 10;
      }
    }

    // Strings for continuing, winning and losing
    let bottomText = "Choose to either **HIT** or **STAND**";
    if (playerPoints === 21) {
      bottomText = "**Blackjack!** " + winString;
      dealerString = `Dealer cards: \n• ${namedCards[1]} \n• ${namedCards[3]}`;
      hiddenDealerPoints = dealerPoints;
    } else if (playerPoints > 21) {
      bottomText = loseString;
      dealerString = `Dealer cards: \n• ${namedCards[1]} \n• ${namedCards[3]}`;
      hiddenDealerPoints = dealerPoints;
    }

    // Changing Embed
    blackjackEmbed.fields[0] = {
      name: dealerString,
      value: `Score: **${hiddenDealerPoints}**`,
    };
    blackjackEmbed.fields[1] = {
      name: yourString,
      value: `Score: **${playerPoints}**`,
    };
    blackjackEmbed.fields[2].value = bottomText;

    // Replying with embed
    interaction.reply({ embeds: [blackjackEmbed] });

    // Building buttons
    // We set the id of the button to contain the message holder's id so when the iteraction is used it can check if the right person is clicking
    const hitButton = new ButtonBuilder()
      .setCustomId(`hit` + interaction.user.id)
      .setLabel("HIT")
      .setStyle(ButtonStyle.Primary);

    const standButton = new ButtonBuilder()
      .setCustomId(`stand` + interaction.user.id)
      .setLabel("STAND")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(hitButton, standButton);
    const messageObject = {
      components: [row],
    };

    // If continuing send the buttons
    if (bottomText === "Choose to either **HIT** or **STAND**") {
      // Set timeout ensures it sends after the embed
      setTimeout(() => {
        interaction.channel.send(messageObject);
      }, 500);
      // Return with new values and flag = 0
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
    // Else if statement for Stand choice
    // Strings for embed
    let dealerString = `Dealer cards: \n• ${namedCards[1]} \n• ${namedCards[3]}`;
    let yourString = `Your cards: \n• ${namedCards[0]}\n• ${namedCards[2]}`;

    // We drew one card at the beginning which is if the card is needed
    // Thus to create the new your string
    const cardAmount = namedCards.length;
    for (let i = 4; i < cardAmount - 1; i++) {
      yourString = yourString + `\n• ${namedCards[i]}`;
    }

    // Embed new fields ofr 2 card win
    blackjackEmbed.fields[0] = {
      name: dealerString,
      value: `Score: **${dealerPoints}**`,
    };
    blackjackEmbed.fields[1] = {
      name: yourString,
      value: `Score: **${playerPoints}**`,
    };

    // 2 Card Blackjack for Dealer
    if (dealerPoints === 21) {
      blackjackEmbed.fields[2].value = "**Blackjack!** " + loseString;
      interaction.reply({ embeds: [blackjackEmbed] });
      return {
        flag: 1,
        chosenCards: [],
        namedCards: [],
        dealerPoints: 0,
        playerPoints: 0,
      };
    } // Dealer must stand on 17 and more
    else if (dealerPoints >= 17) {
      if (dealerPoints > playerPoints) {
        blackjackEmbed.fields[2].value = loseString;
        interaction.reply({ embeds: [blackjackEmbed] });
      } else {
        blackjackEmbed.fields[2].value = winString;
        interaction.reply({ embeds: [blackjackEmbed] });
      }
      return {
        flag: 1,
        chosenCards: [],
        namedCards: [],
        dealerPoints: 0,
        playerPoints: 0,
      };
    }

    // Now onto a 3 card win
    dealerPoints += points;
    // Same as player points for aces, but now for the dealer
    let aceCount = 0;
    let totalDealerPoints = 0;
    const index = chosenCards.indexOf(card);
    dealerString = dealerString + `\n• ${namedCards[index]}`;
    blackjackEmbed.fields[0] = {
      name: dealerString,
      value: `Score: **${dealerPoints}**`,
    };
    if (namedCards[1].includes("Ace")) {
      aceCount++;
    }
    if (namedCards[3].includes("Ace")) {
      aceCount++;
    }
    if (namedCards[index].includes("Ace")) {
      aceCount++;
    }

    totalDealerPoints =
      cardPoints[chosenCards[1]] +
      cardPoints[chosenCards[3]] +
      cardPoints[chosenCards[index]];

    if (dealerPoints > 21) {
      if (aceCount >= 1 && totalDealerPoints - aceCount * 10 <= 21) {
        dealerPoints -= 10;
      }
    }

    // After adding the first card
    if (dealerPoints === 21) {
      blackjackEmbed.fields[2].value = "**Blackjack!** " + loseString;
      interaction.reply({ embeds: [blackjackEmbed] });
    } // If after 3rd card we are still < 17, we keep drawing until we are not
    else if (dealerPoints <= 16) {
      while (dealerPoints < 17) {
        // Drawing cards in a loop
        const response = getRandomNumber(chosenCards);
        const dealerCard = response.value;
        chosenCards = response.chosenCards;
        namedCards = cardConversion(namedCards, dealerCard);
        const points1 = cardPoints[dealerCard];

        // dealing with ace issues
        totalDealerPoints += points1;
        if (points1 === 11) {
          aceCount++;
        }
        dealerPoints += points1;
        if (dealerPoints > 21) {
          if (aceCount >= 1 && totalDealerPoints - aceCount * 10 <= 21) {
            dealerPoints -= 10;
          }
        }
        // Strings for embed
        const index = chosenCards.indexOf(dealerCard);
        dealerString = dealerString + `\n• ${namedCards[index]}`;
        blackjackEmbed.fields[0] = {
          name: dealerString,
          value: `Score: **${dealerPoints}**`,
        };
      }
      // Win and lose conditions outside of loop
      if (dealerPoints === 21) {
        blackjackEmbed.fields[2].value = "**Blackjack!** " + loseString;
        interaction.reply({ embeds: [blackjackEmbed] });
      } else if (dealerPoints < playerPoints) {
        blackjackEmbed.fields[2].value = winString;
        interaction.reply({ embeds: [blackjackEmbed] });
      } else {
        blackjackEmbed.fields[2].value = loseString;
        interaction.reply({ embeds: [blackjackEmbed] });
      }
    } // if after third card it is not 21 but more than 17
    else if (dealerPoints >= 17) {
      if (dealerPoints > 21) {
        // Dealer Loses
        blackjackEmbed.fields[2].value = winString;
        interaction.reply({ embeds: [blackjackEmbed] });
      } else if (dealerPoints > playerPoints) {
        // Dealer is not over 21 but more than player
        blackjackEmbed.fields[2].value = loseString;
        interaction.reply({ embeds: [blackjackEmbed] });
      } else if (dealerPoints === playerPoints) {
        // Same points
        blackjackEmbed.fields[2].value = "**It's a tie!**";
        interaction.reply({ embeds: [blackjackEmbed] });
      }
    }
  }
  // Return and reset all values to initial
  return {
    flag: 1,
    chosenCards: [],
    namedCards: [],
    dealerPoints: 0,
    playerPoints: 0,
  };
}
