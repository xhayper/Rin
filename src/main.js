require("dotenv").config();

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
        let data = await queue.get(guild.id);
        let dispatcher;
        /*if (data.musics[0].duration.seconds !== 0) {
            dispatcher = await data.voiceConnection.playStream(
                await ytdl(data.musics[0].url,
                    {
                        quality: "audioonly"
                    })
            );
            console.log(data.musics[0].url)
        } else {*/
        dispatcher = await data.voiceConnection.playStream(
            await youtubeAudioStream(data.musics[0].url, {
                bitrate: data.voiceConnection.channel.bitrate
            })
        );
        //}

        if (data.volume) {
            dispatcher.setVolume(data.volume / 100)
        }

        let playEmbed = new Discord.RichEmbed()
            .setColor(9472474)
            .setTimestamp(Date.now())
            .setAuthor(`Now playing`, data.musics[0].message.author.avatarURL)
            .setThumbnail(data.musics[0].image)
            .addField("Music Name", data.musics[0].title, true)
            .addField("Author", data.musics[0].author.name, true)
            .addField(
                "Duration",
                data.musics[0].duration.seconds === 0
                    ? "LIVE"
                    : data.musics[0].duration.timestamp,
                true
            )
            .addField(`Link`, `[Here!](${data.musics[0].url})`, true)
            .setFooter(`Requested by ${data.musics[0].message.author.tag}!`);
        await data.channel.send(playEmbed);

        data.dispatcher = dispatcher;

        dispatcher.on("end", (reason) => {
            let targetGuild = dispatcher.player.voiceConnection.channel.guild;
            if (queue.get(targetGuild.id).loop) {
                queue.get(targetGuild.id).musics[queue.get(targetGuild.id).musics.length] = queue.get(targetGuild.id).musics[0];
                queue.get(targetGuild.id).musics.shift();
                this.playMusic(targetGuild);
            } else {
                if (
                    !queue.get(targetGuild.id).musics ||
                    queue.get(targetGuild.id).musics.length === 1
                ) {
                    queue.delete(targetGuild.id);
                    dispatcher.player.voiceConnection.disconnect();
                } else {
                    queue.get(targetGuild.id).musics.shift();
                    this.playMusic(targetGuild);
                }
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

if (!fs.existsSync("./Events")) fs.mkdirSync("./Events");
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

if (!fs.existsSync("./Commands")) fs.mkdirSync("./Commands");
else glob("./Commands/*.js", (err, res) => {
    if (err) return console.error(err);
    let commandAmount = res.length,
        x = 0;
    if (commandAmount === 0) return;
    console.log(`[CommandManager] Found ${commandAmount} commands!`);
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
        console.log(`[CommandManager] Command "${commandName}" has been loaded. (${x}/${commandAmount})`);
    })
});

/*
End Of Command Manager
*/



/*
Login
*/

client.login(process.env.Bot_Token);