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
        .setDescription("I have stopped the music.")
        .setColor(9472474)
        .setTimestamp(Date.now())
        .setAuthor(`Success!`, msg.author.displayAvatarURL);

    msg.channel.send(success1);
    let dispatcher = options.queue.get(msg.guild.id).dispatcher;
    options.queue.delete(msg.guild.id);
    dispatcher.end();
};

exports.config = {
    category: "music",
    powerLevel: 0
};