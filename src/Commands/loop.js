let Discord = require('discord.js');

exports.run = (client, msg, args, options) => {

    let error1 = new Discord.RichEmbed()
        .setDescription("I am not currently playing any song.")
        .setColor(16711681)
        .setTimestamp(Date.now())
        .setAuthor(`Error!`, msg.author.displayAvatarURL);

    let error2 = new Discord.RichEmbed()
        .setDescription("You're not on the same channel as me!")
        .setColor(16711681)
        .setTimestamp(Date.now())
        .setAuthor(`Error!`, msg.author.displayAvatarURL);

    if (!options.queue.get(msg.guild.id)) { return msg.channel.send(error1); }

    if(!msg.member.voiceChannel.connection || options.queue.get(msg.guild.id).voiceConnection && options.queue.get(msg.guild.id).voiceConnection.channel.id !== msg.member.voiceChannel.connection.channel.id) { return msg.channel.send(error2); }

    let success1 = new Discord.RichEmbed()
        .setDescription(`I am ${options.queue.get(msg.guild.id).loop ? "going to stop looping" : "going to loop"} the queue!`)
        .setColor(9472474)
        .setTimestamp(Date.now())
        .setAuthor(`Success!`, msg.author.displayAvatarURL);

    options.queue.get(msg.guild.id).loop = !options.queue.get(msg.guild.id).loop;
    msg.channel.send(success1);
};

exports.config = {
    category: "music",
    powerLevel: 0
};