 let Discord = require("discord.js");

exports.run = (client, options, cmdArgs) => {
    let msg = cmdArgs[0];
    if (msg.content.startsWith(options.config.prefix) && !msg.author.bot && msg.channel.type === "text") {

        let error1 = new Discord.RichEmbed()
            .setDescription("You can't use that command!")
            .setColor(16711681)
            .setTimestamp(Date.now())
            .setAuthor(`Error`, msg.author.displayAvatarURL);

        let commandName = msg.content.split(" ")[0].replace(options.config.prefix, "");
        let args = msg.content.split(" ");
        args.shift();
        if (options.commandList.get(commandName)) {
            let canUse = false;
            let cL = options.commandList.get(commandName);
            let cI = cL.commandInstance;
            if (!cI.config || cI.config && cI.config.powerLevel === 0) canUse = true;
            else if (cI.config && cI.config.powerLevel <= options.functions.checkPerms(msg.member).permissionLevel || options.functions.checkPerms(msg.member).permissionLevel === 4) canUse = true;
            if (cL.commandName.toLowerCase() === commandName.toLowerCase() && canUse) cL.commandInstance.run(client, msg, args, options);
            else if (cI.config && cI.config.aliases) {
                cI.config.aliases.forEach(a => {
                    if (a.toLowerCase() === commandName.toLowerCase()) {
                        if (!canUse) return args[0].channel.send(error1);
                        cL.commandInstance.run(client, msg, args, options);
                    }
                })

            }
        }
    }
};
