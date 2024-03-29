let ytdl = require('ytdl-core'),
    Discord = require('discord.js'),
    ytpl = require('ytpl'),
search = require('yt-search');

exports.run = async (client, msg, args, options) => {

    let error1 = new Discord.RichEmbed()
        .setDescription("You need to be in a voice channel!")
        .setColor(16711681)
        .setTimestamp(Date.now())
        .setAuthor(`Error!`, msg.author.displayAvatarURL);

    let error2 = new Discord.RichEmbed()
        .setDescription("You need to specify a Video URL or Search String!")
        .setColor(16711681)
        .setTimestamp(Date.now())
        .setAuthor(`Error!`, msg.author.displayAvatarURL);

    let error3 = new Discord.RichEmbed()
        .setDescription(`Can't find any video with "${args[0]}" search string!`)
        .setColor(16711681)
        .setTimestamp(Date.now())
        .setAuthor(`Error!`, msg.author.displayAvatarURL);

    let error4 = new Discord.RichEmbed()
        .setDescription(`Sorry! But i can't join that voice channel!`)
        .setColor(16711681)
        .setTimestamp(Date.now())
        .setAuthor(`Error!`, msg.author.displayAvatarURL);

    if (!msg.member.voiceChannel && !msg.guild.me.voiceChannel) return msg.channel.send(error1);

    if (!msg.member.voiceChannel.joinable) return msg.channel.send(error4);

    if (!args[0]) return msg.channel.send(error2);

    let voiceConnection = await msg.member.voiceChannel.join();

    if (!msg.guild.me.deaf) await msg.guild.me.setDeaf(true);

    if (!options.queue.get(msg.guild.id)) {
        options.queue.set(msg.guild.id, {
            message: msg,
            channel: msg.channel,
            loop: false,
            musics: [],
            volume: 30,
            voiceChannel: msg.member.voiceChannel,
            voiceConnection: voiceConnection,
        })
    }

    if (ytdl.validateURL(args[0]) || ytdl.validateID(args[0])) {
        if (ytpl.validateURL(args[0])) {
            let playlist = await ytpl(args[0]);

            let waiting1 = new Discord.RichEmbed()
                .setColor(9472474)
                .setTimestamp(Date.now())
                .setAuthor(`Adding playlist to the queue! Please wait!`, msg.author.avatarURL);

            let waitMsg = await msg.channel.send(waiting1);
            for (const i of playlist.items) {
                try {
                    let newData = await search({
                        videoId: ytdl.getURLVideoID(i.url_simple)
                    });
                    newData.message = msg;
                    await options.queue.get(msg.guild.id).musics.push(newData);
                } catch (e) {
                    break;
                }
            }
            let success2 = new Discord.RichEmbed()
                .setColor(9472474)
                .setTimestamp(Date.now())
                .setAuthor(`Added playlist to the queue!`, msg.author.avatarURL)
                .addField("Videos Count", playlist.items.length, true)
                .addField("Playlist Name", playlist.title, true)
                .addField("Playlist Author", playlist.author.name, true);
            waitMsg.edit(success2);
            if (!options.queue.get(msg.guild.id).dispatcher) {
                options.functions.playMusic(msg.guild)
            }
        } else if (ytdl.validateURL(args[0])) {
            let videoData = await search({
                videoId: ytdl.getURLVideoID(args[0])
            });
            videoData.message = msg;
            options.queue.get(msg.guild.id).musics.push(videoData);
            let success1 = new Discord.RichEmbed()
                .setColor(9472474)
                .setTimestamp(Date.now())
                .setAuthor(`Added Music To Queue!`, msg.author.avatarURL)
                .setThumbnail(videoData.image)
                .addField("Music Name", videoData.title, true)
                .addField("Author", videoData.author.name, true)
                .addField("Duration", videoData.duration.timestamp, true);
            msg.channel.send(success1);
            if (!options.queue.get(msg.guild.id).dispatcher) options.functions.playMusic(msg.guild);
        }
    } else {
        let searchResult = await search(args.join(" "));
        if (!searchResult) return await msg.channel.send(error3);
        let videoData = searchResult.videos[0];
        videoData.message = msg;
        options.queue.get(msg.guild.id).musics.push(videoData);
        let success1 = new Discord.RichEmbed()
            .setColor(9472474)
            .setTimestamp(Date.now())
            .setAuthor(`Added Music To Queue!`, msg.author.avatarURL)
            .setThumbnail(videoData.image)
            .addField("Music Name", videoData.title, true)
            .addField("Author", videoData.author.name, true)
            .addField("Duration", videoData.duration.timestamp, true);
        msg.channel.send(success1);
        if (!options.queue.get(msg.guild.id).dispatcher) options.functions.playMusic(msg.guild);
    }
};

exports.config = {
    category: "music",
    powerLevel: 0
};