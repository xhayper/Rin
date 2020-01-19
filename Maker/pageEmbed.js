let Discord = require("discord.js");

class pageEmbedMaker {

    data = [];
    embed = new Discord.RichEmbed();
    message;
    author;
    page = 1;
    maxPage = 1;

    constructor(data) {
        if (data instanceof Object) {
            if (Math.ceil(data.length / 10) === 0) return;
            data.forEach(element => { this.data.push(element); });
        } else if (data instanceof String || data instanceof Number) {
            this.data.push(Object);
        } else {
            this.data.push(Object);
        }
        this.maxPage = Math.ceil(this.data.length / 10);
    }

    getEmbed() {
        return this.embed;
    }

    setTitle(text) {
        this.embed.setTitle(text)
    }

    setColor(color) {
        this.embed.setColor(color);
    }

    setThumbnail(text) {
        this.embed.setThumbnail(text)
    }

    setFooter(text) {
        this.embed.setFooter(text)
    }

    nextPage() {
        if (this.page === 0) this.page = 1;
        if (this.message && this.embed) {
            if (this.page < this.maxPage) {
                this.page++;
                let tempData = [];
                for (let i = (this.page * 10)-10; i < (this.page * 10); i++) {
                    if (!this.data[i]) break;
                    tempData.push(this.data[i]);
                }
                this.embed.setDescription(tempData.join("\n"));
                this.embed.setFooter(this.embed.footer.text.replace(this.page > this.maxPage ? (this.maxPage - 1).toString() : (this.page - 1).toString(), this.page.toString()));
                this.message.edit(this.embed);
            }
        }

        const filter = (reaction, user) => {
            return ['⬅', '🚪', '➡'].includes(reaction.emoji.name) && user.id === this.author.id;
        };

        this.message.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
            .then(collected => {
                const reaction = collected.first();
                reaction.remove(this.author.id);
                if (reaction.emoji.name === '⬅') {
                    this.prevPage();
                } else if (reaction.emoji.name === '🚪') {
                    this.message.delete();
                } else {
                    this.nextPage();
                }
            }).catch((e) => {})
    }

    prevPage() {
        if (this.page === 0) this.page = 1;
        if (this.message && this.embed) {
            if (this.page > 1 || this.page >= this.maxPage) {
                this.page--;
                let tempData = [];
                for (let i = (this.page * 10)-10; i < (this.page * 10); i++) {
                    if (!this.data[i]) break;
                    tempData.push(this.data[i]);
                }
                this.embed.setDescription(tempData.join("\n"));
                this.embed.setFooter(this.embed.footer.text.replace((this.page + 1).toString(), this.page.toString()));
                this.message.edit(this.embed);
            }
        }

        const filter = (reaction, user) => {
            return ['⬅', '🚪', '➡'].includes(reaction.emoji.name) && user.id === this.author.id;
        };

        this.message.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
            .then(collected => {
                const reaction = collected.first();
                reaction.remove(this.author.id);
                if (reaction.emoji.name === '⬅') {
                    this.prevPage();
                } else if (reaction.emoji.name === '🚪') {
                    this.message.delete();
                } else {
                    this.nextPage();
                }
            }).catch((e) => {})
    }

    setAuthor(user) {
        if (!user instanceof Discord.User) return;
        this.author = user;
    }

    start(channel) {
        if (channel instanceof Discord.TextChannel) {

            let tempData = [];
            for (let i = 0; i < 10; i++) {
                if (!this.data[i]) break;
                tempData.push(this.data[i]);
            }

            this.embed.setDescription(tempData.join("\n"));
            if (!this.embed.title) this.embed.setTitle(`Entries [${this.data.length}]`);
            else this.embed.setTitle(`${this.embed.title} [${this.data.length}]`);
            if (!this.embed.footer) this.embed.setFooter(`Page [${this.page}/${this.maxPage}]`);
            else this.embed.setFooter(`${this.embed.footer.text} | Page [${this.page}/${this.maxPage}]`);
            channel.send(this.embed).then((msg) => {
                this.message = msg;
                if (this.data.length > 10) {
                    msg.react('⬅')
                        .then(() => msg.react('🚪'))
                        .then(() => msg.react('➡'));

                    const filter = (reaction, user) => {
                        return ['⬅', '🚪', '➡'].includes(reaction.emoji.name) && user.id === this.author.id;
                    };

                    msg.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
                        .then(collected => {
                            const reaction = collected.first();
                            reaction.remove(this.author.id);
                            if (reaction.emoji.name === '⬅') {
                                this.prevPage();
                            } else if (reaction.emoji.name === '🚪') {
                                msg.delete();
                            } else {
                                this.nextPage();
                            }
                        }).catch((e) => {});
                }
            });
        }
    }

}

module.exports = pageEmbedMaker;