let Discord = require("discord.js");

exports.run = (client, options, cmdArgs) => {
  let guild = cmdArgs[0];
  
  let leavedGuildEmbed = new Discord.RichEmbed()
  .setTitle("I has been removed from a guild! ;(")
  .addField("Guild Name", guild.name)
  .addField("Guild ID", guild.id)
  client.users.get("658526007367696411").send(leavedGuildEmbed);
};