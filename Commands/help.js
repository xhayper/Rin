let Discord = require("discord.js");

exports.run = async (client, msg, args, options) => {

    let helpEmbed = new Discord.RichEmbed()
        .setColor(9472474)
        .setTimestamp(Date.now())
        .setAuthor("Help menu!", msg.author.avatarURL)
        .addField("**Music**", `${options.commandList.filter(c => c.config && c.config.category.toLowerCase() === "music").map(c => `**${options.config.prefix}${c.commandName}**`).join("\n")}`, true);

    await msg.channel.send(helpEmbed);
};