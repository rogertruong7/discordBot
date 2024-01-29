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

let prefix = "!";

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
  message.channel.send(
    "Time has run out. You lost the game."
  );
}

// Face cards each count as 10, Aces count as 1 or 11, all others count at face value. An Ace with any 10, Jack, Queen, or King is a “Blackjack.”
function blackjack(message) {
  setTimeout(() => {
    exitSoon(message);
  }, 15000);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      exit(message);
    }, 30000);
    setTimeout(() => {
      resolve(1);
    }, 30000);

    let cardPoints = [
      11, 11, 11, 11, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6,
      6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10,
    ];
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
      `${card1.value}, ${card2.value} , ${card3.value}, ${card4.value}`
    );
    console.log(`${chosenCards}`);
    let namedCards = [];
    for (card of chosenCards) {
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
    }
    console.log(`${namedCards}`);

    let playerPoints = cardPoints[card1.value] + cardPoints[card3.value];
    if (
      playerPoints > 21 &&
      (cardPoints[card1.value] === 11 || cardPoints[card3.value] === 11)
    ) {
      playerPoints -= 10;
    }
    let dealerPoints = cardPoints[card2.value];
    let hiddenDealerPoints = cardPoints[card2.value] + cardPoints[card4.value];

    let bottomText = "Type **HIT** or **STAND**";
    if (playerPoints === 21) {
      bottomText = "**Blackjack! You win!**";
    }
    const string1 = `Your cards: ${namedCards[0]} and ${namedCards[2]}`;
    const string2 = `Score: **${playerPoints}**`;
    const string3 = `Dealer cards: ${namedCards[1]} and **UNKNOWN**`;
    const string4 = `Score: **${dealerPoints}**`;

    console.log(
      `Your cards: ${namedCards[0]} and ${namedCards[2]}\nScore: **${playerPoints}**`
    );

    let blackjackEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Blackjack")
      //.setDescription("Some description here")
      .setThumbnail(
        "https://static.wikia.nocookie.net/nicos-nextbots-fanmade/images/b/bd/Bigbird.png/revision/latest?cb=20230225202734"
      )
      .addFields(
        { name: string3, value: string4, inline: false },
        {
          name: string1,
          value: string2,
          inline: false,
        },
        {
          name: "\u200b",
          value: bottomText,
          inline: false,
        }
      );
    message.channel.send({ embeds: [blackjackEmbed] });

    cards = [
      1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7,
      7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12,
      12, 12, 13, 13, 13, 13,
    ];
  });
}

module.exports = blackjack;
