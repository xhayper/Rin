let Discord = require("discord.js");

exports.run = (client, options, cmdArgs) => {
    let guildMember = cmdArgs[0],
        guild = guildMember.guild;
    if (guild.id != "668305538378891284") return;
    guildMember.addRole("668306746305019904", "Welcome!");
  
    let welcomeEmbed = new Discord.RichEmbed()
  
    guild.channels.get("668365425226154004").send()
};