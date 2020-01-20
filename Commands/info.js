let Discord = require('discord.js'),
    os = require("os");

exports.run = async (client, msg, args, options) => {

    let osType = {
        "Linux": "Linux",
        "Darwin": "macOS",
        "Windows_NT": "Windows"
    };

    let informationEmbed = new Discord.RichEmbed()
        .setAuthor(`${client.user.username}'s Information!`, client.user.displayAvatarURL)
        .setColor(9472474)
        .addField(`Numbers!`,
            `Guilds : ${client.guilds.size}\n
            Users : ${client.users.size}\n
            Channels : ${client.channels.size}\n
            Commands : ${options.commandList.size} commands\n
            Playing music on : ${options.queue.length ? options.queue.length : 0} guilds`, true)
        .addField(`System!`, `
        OS : ${osType[os.type()]}\n
        RAM : ${Math.round((os.totalmem() / 1000000) - (os.freemem() / 1000000))}mb/${Math.round(os.totalmem() / 1000000)}mb`, true);

  
    msg.channel.send(informationEmbed);
};

exports.config = {
    category: "information",
    powerLevel: 0
};