exports.run = async (client, options, cmdArgs) => {
    console.log(`[Client] Ready!, Logged in as ${client.user.username}#${client.user.discriminator}`);

    if (client.voiceConnections) client.voiceConnections.forEach(vc => { vc.disconnect(); });

    let status = [`music | ${options.config.prefix}`, `${client.users.size - 2} users! | ${options.config.prefix}`];

    let statusChanger = async () => {
        setTimeout(async () => {
            await client.user.setStatus('idle');
            let statusType;
            Math.floor(Math.random() * 2) === 1 ? statusType = 0 : statusType = 2;
            if (statusType === 2) {
                await client.user.setPresence({
                    game: {
                        name: status[Math.floor(Math.random() * status.length)],
                        type: "LISTENING"
                    }
                });
            } else {
                await client.user.setPresence({
                    game: {
                        name: `music on ${options.queue.size ? options.queue.size : 0} ${options.queue.size === 1 || !options.queue.size ? "guild" : "guilds"}. | r$`,
                        type: "PLAYING"
                    }
                });
            }
            await statusChanger();
        }, 5000)
    };

    await statusChanger();
};
