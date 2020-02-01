require("dotenv").config();

let Discord = require("discord.js"),
    client = new Discord.Client({disableEveryone : true}),
    permissionConfig = require("./permissionConfig"),
    config = require("./config.json"),
    youtubeAudioStream = require("@isolution/youtube-audio-stream"),
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

    botOwnerList = config.ownerList;
    permsConfig = permissionConfig;
    permsLevelCount = 0;
    perms;

    checkPerms(member) {
        if (!member instanceof Discord.GuildMember) return;
        if (this.botOwnerList.length() === 1 && this.botOwnerList[0] === member.id || this.botOwnerList.length() > 1 && this.botOwnerList.includes(member.id)) {
            return this.permsConfig[4];
        } else if (this.permsLevelCount <= 1) {
            return this.permsConfig[0];
        } else if (member.has("administrator")) {
            return this.permsConfig[3];
        } else {
            for (this.perms in this.permsConfig) {
                let allowedPermissionCount = 0;
                let deniedPermissionCount = 0;
                this.perms.permission.forEach(p => {
                    if (member.has(p)) allowedPermissionCount++;
                    else deniedPermissionCount--;
                });
                if (allowedPermissionCount > deniedPermissionCount) return this.perms;
            }
        }
    }

    async playMusic(guild) {
        if (!queue.get(guild.id) || queue.get(guild.id).size === 0) return;
        let data = queue.get(guild.id);
        let dispatcher = data[0].voiceConnection.playStream(
            await youtubeAudioStream(data[0].videoData.url, {
                bitrate: data[0].voiceConnection.channel.bitrate
            })
        );

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
            .setFooter(`Requested by ${data[0].message.author.tag}!`);
        await data[0].channel.send(playEmbed);

        data[0].dispatcher = dispatcher;

        dispatcher.on("finish", async () => {
            let targetGuild = dispatcher.player.voiceConnection.channel.guild;
            if (
                !queue.get(targetGuild.id) ||
                queue.get(targetGuild.id).size === 1 ||
                queue.get(targetGuild.id).size === 0
            ) {
                await dispatcher.player.voiceConnection.disconnect();
                queue.delete(targetGuild.id);
            } else {
                 await queue.get(targetGuild.id).shift();
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

if (!fs.existsSync("./Events")) return fs.mkdirSync("./Events");
else glob("./Events/*.js", (err, res) => {
    if (err) return console.error(err);
    let eventAmount = res.length,
        x = 0;
    if (eventAmount === 0) return;
    console.log(`[EventManager] Found ${eventAmount} events!`);
    res.forEach(e => {
        let event = require(e);
        let eventName = e.replace("./Events/", "").replace(".js", "");
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

if (!fs.existsSync("./Commands")) return fs.mkdirSync("./Commands");
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
Login
*/

//client.login(process.env.Bot_Token);

/*
Express Stuff
*/

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))