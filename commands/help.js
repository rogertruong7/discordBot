
import {
  EmbedBuilder,
} from "discord.js";

let prefix = "!";

const helpEmbed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle("List of Commands")
  //.setURL("https://discord.js.org/")
  .setAuthor({
    name: "The Biggest Bird",
    iconURL:
      "https://static.wikia.nocookie.net/nicos-nextbots-fanmade/images/b/bd/Bigbird.png/revision/latest?cb=20230225202734",
    url: "https://discord.js.org",
  })
  //.setDescription("Some description here")
  .setThumbnail(
    "https://static.wikia.nocookie.net/nicos-nextbots-fanmade/images/b/bd/Bigbird.png/revision/latest?cb=20230225202734"
  )
  .addFields(
    { name: prefix + "help", value: "Gives a list of commands", inline: false },
    {
      name: prefix + "blackjack {bet}",
      value: "Play blackjack with your money.",
      inline: false,
    },
    {
      name: prefix + "exit",
      value: "Leave game. Lose your bet.",
      inline: false,
    },
    {
      name: prefix + "gunfight @user",
      value: "Challenge someone to a type race. Type the word as fast as possible",
      inline: false,
    },
    {
      name: prefix + "cockfight {bet}",
      value:
        "Not done yet... Fight with your chicken, each win increases your chances of winning.",
      inline: false,
    },
    {
      name: prefix + "daily",
      value:
        "Collect daily money. The first time using this command will automatically add $500 to your balance along with the daily money.",
      inline: false,
    }
  );
export default function help(message) {
  message.reply({ embeds: [helpEmbed] });
  return;
}

