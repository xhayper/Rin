require("dotenv").config({ path: process.env.HOME });

let Discord = require("discord.js"),
    client = new Discord.Client({disableEveryone : true}),
    permissionConfig = require("./permissionConfig"),
    config = require("./config.json"),
    youtubeAudioStream = require("@isolution/youtube-audio-stream"),
    ytdl = require("ytdl-core"),
    fs = require("fs"),
    glob = require("glob"),

/*
Register All Collection
*/

commandList = new Discord.Collection(),
queue = new Discord.Collection();

/*
Start Of Register Functions
*/

class Function {

    checkPerms(member) {
        if (!member instanceof Discord.GuildMember) return;
        if (config.ownerList.length === 1 && config.ownerList[0] === member.user.id || config.ownerList.length > 1 && config.ownerList.includes(member.user.id)) {
            return permissionConfig["4"];
        } else if (Object.keys(permissionConfig).length <= 1) {
            return permissionConfig["0"];
        } else if (member.permissions.has("ADMINISTRATOR")) {
            return permissionConfig["2"];
        } else {
            let perms;
            for (perms in permissionConfig) {
                let allowedPermissionCount = 0;
                let deniedPermissionCount = 0;
                if (perms.permission) {
                    perms.permission.forEach(p => {
                        if (member.permissions.has(p.toUpperCase())) allowedPermissionCount++;
                        else deniedPermissionCount--;
                    });
                    if (allowedPermissionCount > deniedPermissionCount) return perms;
                }
            }
            return permissionConfig["0"];
        }
    }

    async playMusic(guild) {
        if (!queue.get(guild.id) || queue.get(guild.id).size === 0) return;
        let data = queue.get(guild.id);
        //let dispatcher;
        /*if (data[0].videoData.duration.seconds !== 0) {
            dispatcher = data[0].voiceConnection.playStream(
                await ytdl('http://www.youtube.com/watch?v=A02s8omM_hI',
                    {
                        quality: "highestaudio"
                    })
            );
        } else {*/
        let dispatcher = data[0].voiceConnection.playStream(
                await youtubeAudioStream(data[0].videoData.url, {
                    bitrate: data[0].voiceConnection.channel.bitrate
                })
            );
        //}

        dispatcher.setVolume(0.3);

        let playEmbed = new Discord.RichEmbed()
            .setColor(9472474)
            .setTimestamp(Date.now())
            .setAuthor(`Now playing`, data[0].message.author.avatarURL)
            .setThumbnail(data[0].videoData.image)
            .addField("Music Name", data[0].videoData.title, true)
            .addField("Author", data[0].videoData.author.name, true)
            .addField(
                "Duration",
                data[0].videoData.duration.seconds === 0
                    ? "LIVE"
                    : data[0].videoData.duration.timestamp,
                true
            )
            .addField(`Link`, `[Here!](${data[0].videoData.url})`, true)
            .setFooter(`Requested by ${data[0].message.author.tag}!`);
        await data[0].channel.send(playEmbed);

        data[0].dispatcher = dispatcher;

        dispatcher.on("finish", () => {
            let targetGuild = dispatcher.player.voiceConnection.channel.guild;
            if (
                !queue.get(targetGuild.id) ||
                queue.get(targetGuild.id).length === 1
            ) {
                queue.delete(targetGuild.id);
                dispatcher.player.voiceConnection.disconnect();
            } else {
                queue.get(targetGuild.id).shift();
                this.playMusic(targetGuild);
            }
        });
    }

}

/*
End Of Registering Function
*/

/*
Register Options And Makers
*/

let makers = {
    embedMaker: require("./Maker/pageEmbed.js")
};

let options = {
    commandList: commandList,
    queue: queue,
    config: config,
    maker: makers,
    functions: new Function
};

/*
Start Of Event Manager
*/

if (!fs.existsSync("src/Events")) fs.mkdirSync("src/Events");
else glob("src/Events/*.js", (err, res) => {
    if (err) return console.error(err);
    let eventAmount = res.length,
        x = 0;
    if (eventAmount === 0) return;
    console.log(`[EventManager] Found ${eventAmount} events!`);
    res.forEach(e => {
        let event = require("src" + );
        console.log(event);
        let eventName = e.replace("src/Events/", "").replace(".js", "");
        if (!event.run) return console.log(`[EventManager] Event "${eventName}" doesn't have main function, Unloading it.`);
        client.on(eventName, (...args) => {
            event.run(client, options, args)
        });
        x++;
        console.log(`[EventManager] Event "${eventName}" has been loaded. (${x}/${eventAmount})`);
    })
});

/*
End Of Event Manager
*/

/*
Start Of Command Manager
*/

if (!fs.existsSync("./Commands")) fs.mkdirSync("./Commands");
else glob("./Commands/*.js", (err, res) => {
    if (err) return console.error(err);
    let eventAmount = res.length,
        x = 0;
    if (eventAmount === 0) return;
    console.log(`[CommandManager] Found ${eventAmount} commands!`);
    res.forEach(c => {
        let command = require(c);
        let commandName = c.replace("./Commands/", "").replace(".js", "");
        if (!command.run) return console.log(`[CommandManager] Command "${commandName}" doesn't have main function, Unloading it.`);
        x++;
        let commandData = {
            commandName: commandName,
            commandInstance: command,
            commandPath: "." + c
        };
        if (command.config) {
            if (command.config.aliases) commandData.aliases = command.config.aliases;
            commandData.config = command.config;
        }
        commandList.set(commandName.toLowerCase(), commandData);
        console.log(`[CommandManager] Command "${commandName}" has been loaded. (${x}/${eventAmount})`);
    })
});

/*
End Of Command Manager
*/


/*
Express
*/

const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`));

/*
Login
*/

client.login(process.env.Bot_Token);