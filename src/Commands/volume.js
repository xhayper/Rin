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

    let error3 = new Discord.RichEmbed()
        .setDescription("The volume has to between 0 and 100!")
        .setColor(16711681)
        .setTimestamp(Date.now())
        .setAuthor(`Error!`, msg.author.displayAvatarURL);

    if (!options.queue.get(msg.guild.id)) { return msg.channel.send(error1); }

    if(!msg.member.voiceChannel.connection || options.queue.get(msg.guild.id).voiceConnection && options.queue.get(msg.guild.id).voiceConnection.channel.id !== msg.member.voiceChannel.connection.channel.id) { return msg.channel.send(error2); }

    let dispatcher = options.queue.get(msg.guild.id).dispatcher;

    let currentVolume = new Discord.RichEmbed()
        .setDescription(`Current volume is ${dispatcher.volume * 100}!`)
        .setColor(9472474)
        .setTimestamp(Date.now())
        .setAuthor(`Current Volume`, msg.author.displayAvatarURL);

    if(!args[0]) return msg.channel.send(currentVolume);

    if(0 < args[0] > 100) return msg.channel.send(error3);

    let success1 = new Discord.RichEmbed()
        .setDescription(`I have set the volume to ${args[0]}!`)
        .setColor(9472474)
        .setTimestamp(Date.now())
        .setAuthor(`Success!`, msg.author.displayAvatarURL);

    msg.channel.send(success1);
    options.queue.get(msg.guild.id).volume = args[0];
    dispatcher.setVolume(args[0] / 100);
};

exports.config = {
    category: "music",
    powerLevel: 0
};