
const {
  EmbedBuilder,
} = require("discord.js");

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
    { name: prefix + "help", value: "Some value here", inline: false },
    {
      name: prefix + "blackjack {bet}",
      value: "Play blackjack with your money.",
      inline: false,
    },
    {
      name: prefix + "cockfight {bet}",
      value:
        "Fight with your chicken, each win increases your chances of winning.",
      inline: false,
    },
    {
      name: prefix + "daily",
      value:
        "Collect daily money. The first time using this command will automatically add $500 to your balance along with the daily money.",
      inline: false,
    }
  );
function help(message) {
    message.channel.send({ embeds: [helpEmbed] });
    return;
}

module.exports = help;