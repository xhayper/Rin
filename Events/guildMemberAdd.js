let Discord = require("discord.js");

exports.run = (client, options, cmdArgs) => {
  function ordinal_suffix_of(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }

  let guildMember = cmdArgs[0],
    guild = guildMember.guild;
  if (guild.id != "668305538378891284") return;
  guildMember.addRole("668306746305019904", "Welcome!");

  let welcomeEmbed = new Discord.RichEmbed()
    .setAuthor(`Welcome! ${guildMember}`, guildMember.user.displayAvatarURL)
    .setThumbnail(guildMember.user.displayAvatarURL)
    .setDescription(
      `You're the ${ordinal_suffix_of(
        guild.members.filter(m => !m.user.bot).size
      )} person to join this server!`
    )
    .setTimestamp(Date.now());

  guild.channels.get("668365425226154004").send(welcomeEmbed);
};
