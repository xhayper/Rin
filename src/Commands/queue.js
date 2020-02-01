let ytdl = require('ytdl-core'),
    Discord = require('discord.js'),
    search = require('yt-search');

exports.run = async (client, msg, args, options) => {

    let error1 = new Discord.RichEmbed()
        .setAuthor("Error!", msg.author.displayAvatarURL)
        .setDescription("I am not currently playing any song.")
        .setTimestamp(Date.now())
        .setColor(16711681);

    if (!options.queue.get(msg.guild.id)) return msg.channel.send(error1);

    let data = [];
    let number = 0;

    options.queue.get(msg.guild.id).musics.forEach(d => {
        number++;
       data.push(`${number}. ${d.title} [${d.duration.seconds === 0 ? "LIVE" : d.duration.timestamp}]`);
    });

    let embedPage = new (options.maker.embedMaker)(data);
    embedPage.setTitle("Current Queue");
    embedPage.setFooter(msg.author.tag);
    embedPage.setColor(9472474);
    embedPage.setAuthor(msg.author);

    embedPage.start(msg.channel);

};

exports.config = {
    category: "music",
    powerLevel: 0
};