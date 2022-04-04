const {
  Intents,
  Client,
  Collection,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const { GiveawaysManager, Giveaway } = require("discord-giveaways");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { default: chalk } = require("chalk");
const format = require(`humanize-duration`);
const { Database } = require("quickmongo");
const DatabaseJson = require("quick-fs");
const registrar = require("./Registrar");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const Enmap = require("enmap");
const glob = require("glob");
const path = require("path");
class Bot extends Client {
  constructor() {
    super({
      intents: Object.keys(Intents.FLAGS).filter((f) => f.startsWith("GUILD")),
      partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
      allowedMentions: { parse: ["users", "roles"], repliedUser: true },
      restWsBridgetimeout: 100,
      messageCacheLifetime: 60,
      messageCacheMaxSize: 10,
      fetchAllMembers: false,
      restTimeOffset: 0,
      shards: "auto",
    });
    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.buttons = new Collection();
    this.selects = new Collection();
    this.aliases = new Collection();
    this.db = new DatabaseJson("./database/database.json");
    global.db = new DatabaseJson("./database/database.json");
    global.builder = require("./Others/Builder_CMD");
    global.card = require("./Others/Card");
    global.embed_builder = require("./Others/embed-builder");
    global.MessageEmbed = MessageEmbed;
    global.MessageButton = MessageButton;
    global.MessageActionRow = MessageActionRow;
    global.MessageSelectMenu = MessageSelectMenu;
    global.SlashCommandBuilder = require("./Others/Builder_SLASH");
    global.Discord = Discord;
  }
  async start(token) {
    super.login(token);
    this.on("ready", async () => {
      console.log(
        chalk.cyan("[ INFORMATION ]") +
          chalk.white.bold(" | ") +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(" | ") +
          chalk.cyan("Logged in as") +
          chalk.white(": ") +
          chalk.greenBright(`${client.user.tag}`)
      );
      this.user.setPresence({
        activities: [
          {
            type: "PLAYING",
            name: "BOT TESTING BY FONGSI",
          },
        ],
        status: "dnd",
      });
      registrar(this);
    });
    console.log(
      chalk.white.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫") +
        chalk.blue.bold("Commands") +
        chalk.white.bold("┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    );
    const command = glob.sync("./src/Commands/command/**/*.js");
    for (const file of command) {
      const Command = require(path.resolve(file));
      if (Command.name && Command.category) {
        client.commands.set(Command.name, Command);
        console.log(
          chalk.cyan("[ INFORMATION ]") +
            chalk.white.bold(" | ") +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(" | ") +
            chalk.cyan("Command Load Status") +
            chalk.white.bold(" | ") +
            chalk.blue(Command.name) +
            chalk.white(": ") +
            chalk.greenBright(`Success`)
        );
      } else {
        console.log(
          chalk.cyan("[ INFORMATION ]") +
            chalk.white.bold(" | ") +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(" | ") +
            chalk.cyan("Command Load Status") +
            chalk.white.bold(" | ") +
            chalk.blue(Command.category ? "MISSING NAME" : "MISSING CATEGORY") +
            chalk.white(": ") +
            chalk.redBright(`Failed`) +
            chalk.white.bold(" | ") +
            chalk.cyan(file)
        );
        continue;
      }
      if (Command.aliases && Command.aliases.length) {
        Command.aliases.forEach((alias) =>
          client.aliases.set(alias, Command.name)
        );
      }
    }
    const Settings = glob.sync("./src/Others/**/*.js");
    for (const file of Settings) {
      require(path.resolve(file));
    }
    console.log(
      chalk.white.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫") +
        chalk.blue.bold("Events") +
        chalk.white.bold("┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    );
    const Events = glob.sync("./src/Events/**/*.js");
    for (const file of Events) {
      require(path.resolve(file))(client);
      console.log(
        chalk.cyan("[ INFORMATION ]") +
          chalk.white.bold(" | ") +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(" | ") +
          chalk.cyan("Command Load Status") +
          chalk.white.bold(" | ") +
          chalk.blue(file.replace(/.+\//, "")) +
          chalk.white(": ") +
          chalk.greenBright(`Success`)
      );
    }
    console.log(
      chalk.white.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫") +
        chalk.blue.bold("Interactions") +
        chalk.white.bold("┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    );
    const buttonCommandsFiles = glob.sync("./src/commands/Buttons/**/*.js");
    for (const file of buttonCommandsFiles) {
      const buttonCommand = require(path.resolve(file));
      if (buttonCommand.name) {
        client.buttons.set(buttonCommand.name, buttonCommand);
        console.log(
          chalk.cyan("[ INFORMATION ]") +
            chalk.white.bold(" | ") +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(" | ") +
            chalk.cyan("Button Command Load Status") +
            chalk.white.bold(" | ") +
            chalk.blue(buttonCommand.name) +
            chalk.white(": ") +
            chalk.greenBright(`Success`)
        );
      } else {
        console.log(
          chalk.cyan("[ INFORMATION ]") +
            chalk.white.bold(" | ") +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(" | ") +
            chalk.cyan("Button Command Load Status") +
            chalk.white.bold(" | ") +
            chalk.blue(buttonCommand.name || "MISSING NAME") +
            chalk.white(": ") +
            chalk.redBright(`Failed`) +
            chalk.white.bold(" | ") +
            chalk.cyan(file)
        );
        continue;
      }
    }
    const selectEventFiles = glob.sync("./src/commands/Selects/**/*.js");
    for (const file of selectEventFiles) {
      const selectEvent = require(path.resolve(file));
      if (selectEvent.name) {
        client.selects.set(selectEvent.name, selectEvent);
        console.log(
          chalk.cyan("[ INFORMATION ]") +
            chalk.white.bold(" | ") +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(" | ") +
            chalk.cyan("Select Command Load Status") +
            chalk.white.bold(" | ") +
            chalk.blue(selectEvent.name) +
            chalk.white(": ") +
            chalk.greenBright(`Success`)
        );
      } else {
        console.log(
          chalk.cyan("[ INFORMATION ]") +
            chalk.white.bold(" | ") +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(" | ") +
            chalk.cyan("Select Command Load Status") +
            chalk.white.bold(" | ") +
            chalk.blue(selectEvent.name || "MISSING NAME") +
            chalk.white(": ") +
            chalk.redBright(`Failed`) +
            chalk.white.bold(" | ") +
            chalk.cyan(file)
        );
        continue;
      }
    }
    const slashEventFiles = glob.sync("./src/Commands/Slash/**/*.js");
    for (const file of slashEventFiles) {
      const slashEvent = require(path.resolve(file));
      if (slashEvent.name) {
        client.slashCommands.set(slashEvent.name, slashEvent);
        console.log(
          chalk.cyan("[ INFORMATION ]") +
            chalk.white.bold(" | ") +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(" | ") +
            chalk.cyan("Slash Command Load Status") +
            chalk.white.bold(" | ") +
            chalk.blue(slashEvent.name) +
            chalk.white(": ") +
            chalk.greenBright(`Success`)
        );
      } else {
        console.log(
          chalk.cyan("[ INFORMATION ]") +
            chalk.white.bold(" | ") +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(" | ") +
            chalk.cyan("Slash Command Load Status") +
            chalk.white.bold(" | ") +
            chalk.blue(slashEvent.name || "MISSING NAME") +
            chalk.white(": ") +
            chalk.redBright(`Failed`) +
            chalk.white.bold(" | ") +
            chalk.cyan(file)
        );
        continue;
      }
    }
    console.log(
      chalk.white.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫") +
        chalk.blue.bold("Client Status") +
        chalk.white.bold("┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    );
    /*
    this.db = new Database(`${global.mongourl}`);
    global.db = new Database(`${global.mongourl}`);
    try {
      mongoose
        .connect(global.mongourl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        })
        .catch((err) => console.log(err));
    } catch (e) {
      null;
    }
    mongoose.connection.on("connected", () =>
      console.log(
        chalk.cyan("[ INFORMATION ]") +
          chalk.white.bold(" | ") +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(" | ") +
          chalk.cyan("Mongo DB Connection") +
          chalk.white(": ") +
          chalk.greenBright(`Connected`)
      )
    );
    mongoose.connection.on("disconnected", () =>
      console.log(
        chalk.cyan("[ INFORMATION ]") +
          chalk.white.bold(" | ") +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(" | ") +
          chalk.cyan("Mongo DB Connection") +
          chalk.white(": ") +
          chalk.greenBright(`Disconnected`)
      )
    );
    mongoose.connection.on("error", (error) =>
      console.log(
        chalk.cyan("[ INFORMATION ]") +
          chalk.white.bold(" | ") +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(" | ") +
          chalk.cyan("Mongo DB Connection") +
          chalk.white(": ") +
          chalk.redBright(`Error`) +
          "\n" +
          chalk.white(`${error}`)
      )
    );
    */
    //mongoose error !!!
  }
  async resolveUser(search) {
    if (!search || typeof search !== "string") return null;
    let user = null;
    search = search.split(" ").join("");
    if (search.match(/^<@!?(\d+)>$/))
      user = await this.users
        .fetch(search.match(/^<@!?(\d+)>$/)[1])
        .catch(() => {});
    if (search.match(/^!?(\w+)#(\d+)$/) && !user)
      user = this.users.cache.find(
        (u) =>
          u.username === search.match(/^!?(\w+)#(\d+)$/)[0] &&
          u.discriminator === search.match(/^!?(\w+)#(\d+)$/)[1]
      );
    if (search.match(/.{2,32}/) && !user)
      user = this.users.cache.find((u) => u.username === search);
    if (!user) user = await this.users.fetch(search).catch(() => {});
    return user;
  }
  async resolveMember(search, guild) {
    if (!search || typeof search !== "string") return null;
    search = search.split(" ").join("");
    const user = await this.resolveUser(search);
    if (!user) return null;
    try {
      return await guild.members.fetch(user);
    } catch (e) {
      null;
    }
  }
  resolveRole(search, guild) {
    if (!search || typeof search !== "string") return null;
    search = search.split(" ").join("");
    let role = null;
    if (search.match(/^<@&!?(\d+)>$/))
      role = guild.roles.cache.get(search.match(/^<@&!?(\d+)>$/)[1]);
    if (!role) role = guild.roles.cache.find((r) => r.name === search);
    if (!role) role = guild.roles.cache.get(search);
    return role;
  }
  resolveChannel(search) {
    if (!search) return null;
    let channel = null;
    channel = this.channels.cache.get(
      search
        .replace("<", "")
        .replace("#", "")
        .replace(">", "")
        .split(" ")
        .join("")
    );
    if (!channel) channel = this.channels.cache.find((c) => c.name === search);
    if (!channel) channel = this.channels.cache.get(search);
    return channel;
  }

  async send(
    content,
    {
      message,
      content: content_,
      interaction: message_,
      embed,
      image,
      ephemeral = false,
      thumbnail,
      timeout,
      color = "RANDOM",
      channel: channel_ = null,
    }
  ) {
    try {
      message = message_ ? message_ : message;
      content = content_ ? content_ : content;
      let channel = this.resolveChannel(channel_);
      let user = await this.resolveUser(channel_);
      if (message.commandId) {
        if (channel ? true : false) {
          channel
            .send({
              embeds: embed
                ? embed
                : [
                    {
                      author: {
                        icon_url: message.user.displayAvatarURL({
                          dynamic: true,
                        }),
                        name: message.user.username,
                      },
                      description: content,
                      color: color,
                      image: {
                        url: image ? image : null,
                      },
                      timestamp: new Date(),
                    },
                  ],
            })
            .then((x) => {
              if (timeout) {
                setTimeout(() => {
                  x.delete();
                }, timeout);
              } else null;
            });
        } else if (user ? true : false) {
          user
            .send({
              embeds: embed
                ? embed
                : [
                    {
                      author: {
                        icon_url: message.user.displayAvatarURL({
                          dynamic: true,
                        }),
                        name: message.user.username,
                      },
                      description: content,
                      color: color,
                      image: {
                        url: image ? image : null,
                      },
                      timestamp: new Date(),
                    },
                  ],
            })
            .then((x) => {
              if (timeout) {
                setTimeout(() => {
                  x.delete();
                }, timeout);
              } else null;
            });
        } else {
          message
            .reply({
              embeds: embed
                ? embed
                : [
                    {
                      author: {
                        icon_url: message.user.displayAvatarURL({
                          dynamic: true,
                        }),
                        name: message.user.username,
                      },
                      description: content,
                      color: color,
                      image: {
                        url: image ? image : null,
                      },
                      timestamp: new Date(),
                    },
                  ],
            })
            .then((x) => {
              if (timeout) {
                setTimeout(() => {
                  x.message.delete();
                }, timeout);
              } else null;
            });
        }
      } else {
        if (channel ? true : false) {
          channel
            .send({
              embeds: embed
                ? embed
                : [
                    {
                      author: {
                        icon_url: message?.user
                          ? message.user.displayAvatarURL({
                              dynamic: true,
                            })
                          : message.author.displayAvatarURL({
                              dynamic: true,
                            }),
                        name: message?.user
                          ? message.user.username
                          : message.author.username,
                      },
                      description: content,
                      color: color,
                      image: {
                        url: image ? image : null,
                      },
                      timestamp: new Date(),
                    },
                  ],
            })
            .then((x) => {
              if (timeout) {
                setTimeout(() => {
                  x.delete();
                }, timeout);
              } else null;
            });
        } else if (user ? true : false) {
          user
            .send({
              embeds: embed
                ? embed
                : [
                    {
                      author: {
                        icon_url: message?.user
                          ? message.user.displayAvatarURL({
                              dynamic: true,
                            })
                          : message.author.displayAvatarURL({
                              dynamic: true,
                            }),
                        name: message?.user
                          ? message.user.username
                          : message.author.username,
                      },
                      description: content,
                      color: color,
                      image: {
                        url: image ? image : null,
                      },
                      timestamp: new Date(),
                    },
                  ],
            })
            .then((x) => {
              if (timeout) {
                setTimeout(() => {
                  x.delete();
                }, timeout);
              } else null;
            });
        } else {
          message.channel
            .send({
              embeds: embed
                ? embed
                : [
                    {
                      author: {
                        icon_url: message?.user
                          ? message.user.displayAvatarURL({
                              dynamic: true,
                            })
                          : message.author.displayAvatarURL({
                              dynamic: true,
                            }),
                        name: message?.user
                          ? message.user.username
                          : message.author.username,
                      },
                      description: content,
                      color: color,
                      image: {
                        url: image ? image : null,
                      },
                      timestamp: new Date(),
                    },
                  ],
            })
            .then((x) => {
              if (timeout) {
                setTimeout(() => {
                  x.delete();
                }, timeout);
              } else null;
            });
        }
      }
    } catch (e) {
      console.log(`Error Occured. | Client Send | Error: ${e.stack}`);
    }
    //EZ :v
  }
  async awaitReply(
    content = null,
    {
      message,
      image,
      embed,
      color = "BLUE",
      max = 1,
      time = 60000,
      obj = false,
    }
  ) {
    const filter = (m) => m.author.id === message.author.id;
    await message.channel.send({
      embeds: embed
        ? embed
        : [
            {
              description: content,
              color: color,
              image: {
                url: image ? image : null,
              },
              footer: {
                text: `Time: ${format(time)}`,
              },
              timestamp: new Date(),
            },
          ],
    });

    try {
      const collected = await message.channel.awaitMessages({
        filter,
        max: max,
        time: time,
        errors: ["time"],
      });
      if (obj) {
        return collected.first();
      }
      return collected.first().content;
    } catch (e) {
      return false;
    }
  }
  async emoji(name, option) {
    let emojis = this.guilds.cache
      .get(global.server.id)
      .emojis.cache.find((x) => x.name === name);
    if (!emojis) return "🔸";
    if (option === "id") {
      return emojis.id;
    }
    if (option === "name") {
      return emojis.name;
    }
    if (emojis) {
      return name
        .split(new RegExp(name, "g"))
        .join(emojis.toString())
        .split(" ")
        .join("_");
    }
  }
}

//GIVEAWAY CLIENT MANAGER
const giveawayDB = new Enmap({ name: "giveaways" });

const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
  async getAllGiveaways() {
    return giveawayDB.fetchEverything().array();
  }
  async saveGiveaway(messageId, giveawayData) {
    giveawayDB.set(messageId, giveawayData);
    return true;
  }

  async editGiveaway(messageId, giveawayData) {
    giveawayDB.set(messageId, giveawayData);
    return true;
  }

  async deleteGiveaway(messageId) {
    giveawayDB.delete(messageId);
    return true;
  }

  async refreshStorage() {
    return client.shard.broadcastEval(() =>
      this.giveawaysManager.getAllGiveaways()
    );
  }
  /**
   * @param {Giveaway} giveaway
   */
  generateMainEmbed(giveaway) {
    let mainEmbed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle(`Giveaway Started`)
      .setFooter(
        "Ends At",
        "https://media.discordapp.net/attachments/867344516600037396/881941206513377331/869185703228084285.gif"
      )
      .setThumbnail(giveaway.thumbnail)
      .setDescription(
        `React with the buttons to interact with giveaway.\n` +
          `> **<a:Prize:959847833882751036> Prize:** ***${giveaway.prize}***\n` +
          `> **<a:Timer:959847512854913034> Ends:** ***<t:${Math.round(
            giveaway.endAt / 1000
          )}:R>***\n` +
          `> **<a:Giveaway:959489004577898527> Hosted By:** ***${giveaway.hostedBy}***`
      )
      .addFields(
        {
          name: " <:Winner:959852247632719902> Winner(s):",
          value: `**${giveaway.winnerCount}**`,
        },
        {
          name: "<:People:959852746566160385> People Entered",
          value: `***0***`,
        }
      );
    return mainEmbed;
  }
  generateEndEmbed(giveaway, winners) {
    let formattedWinners = winners.map((w) => `${w}`).join(", ");
    const strings = {
      winners: giveaway.fillInString(giveaway.messages.winners),
      hostedBy: giveaway.fillInString(giveaway.messages.hostedBy),
      endedAt: giveaway.fillInString(giveaway.messages.endedAt),
      prize: giveaway.fillInString(giveaway.prize),
    };

    const descriptionString = (formattedWinners) => formattedWinners;

    for (
      let i = 1;
      descriptionString(formattedWinners).length > 1024 ||
      strings.prize.length +
        strings.endedAt.length +
        descriptionString(formattedWinners).length >
        2000;
      i++
    ) {
      formattedWinners =
        formattedWinners.slice(0, formattedWinners.lastIndexOf(", <@")) +
        `, ${i} more`;
    }
    let mainEmbed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle(`Giveaway Ended`)
      .setFooter(
        "Giveaway Ended.",
        "https://media.discordapp.net/attachments/867344516600037396/881941206513377331/869185703228084285.gif"
      )
      .setThumbnail(giveaway.thumbnail)
      .setDescription(
        `> **<a:Prize:959847833882751036> Prize:** ***${giveaway.prize}***\n` +
          `> **<a:Timer:959847512854913034> Ended:** ***<t:${Math.round(
            giveaway.endAt / 1000
          )}:R>***\n` +
          `> **<a:Giveaway:959489004577898527> Hosted By:** ***${giveaway.hostedBy}***`
      )
      .addFields(
        {
          name: " <:Winner:959852247632719902> Winner(s):",
          value: `**${descriptionString(formattedWinners)}**`,
        },
        {
          name: "<:People:959852746566160385> People Entered",
          value: `***0***`,
        }
      );
    return mainEmbed;
  }
  generateNoValidParticipantsEndEmbed(giveaway) {
    let mainEmbed = new MessageEmbed()
      .setColor("YELLOW")
      .setTitle(`No one Entered.`)
      .setFooter(
        "Giveaway Ended.",
        "https://media.discordapp.net/attachments/867344516600037396/881941206513377331/869185703228084285.gif"
      )
      .setThumbnail(giveaway.thumbnail)
      .setDescription(
        `Sadly No one entered the giveaway ;(.\n` +
          `> **<a:Prize:959847833882751036> Prize:** ***${giveaway.prize}***\n` +
          `> **<a:Timer:959847512854913034> Ends:** ***<t:${Math.round(
            giveaway.endAt / 1000
          )}:R>***\n` +
          `> **<a:Giveaway:959489004577898527> Hosted By:** ***${giveaway.hostedBy}***`
      )
      .addFields(
        {
          name: " <:Winner:959852247632719902> Winner(s):",
          value: `**${giveaway.winnerCount}**`,
        },
        {
          name: "<:People:959852746566160385> People Entered",
          value: `***0***`,
        }
      );
    return giveaway.fillInEmbed(mainEmbed);
  }
};

const client = new Bot();
client.start("OTQ1Njg1MjI3OTQ1MjIyMTg0.YhTwAA.uHMjYvXA89QOrMN3NIOHd0td3fQ");

const manager = new GiveawayManagerWithOwnDatabase(client, global.gdefault);
client.giveawaysManager = manager;

manager.on("giveawayReactionAdded", async (giveaway, member) => {
  client.send(
    `Your Entry Successfully Accepted \n Giveaway in <#${giveaway.channelId}>`,
    { channel: member.id, message: member }
  );
});
manager.on("giveawayReactionRemoved", async (giveaway, member, reaction) => {
  client.send(`Your Entry is Rejected...`, {
    channel: member.id,
    message: member,
  });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  const escapeRegex = (str) =>
    str.replace(/[.<>`•√π÷×¶∆£¢€¥*@_+?^${}()|[\]\\]/g, "\\$&");
  let Prefix = await client.db.get(`Prefix_${message.guild.id}`);
  global.gprefix = Prefix;
  if (!Prefix) Prefix = global.prefix;
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(Prefix)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  let cmd = args.shift().toLowerCase();
  let command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) return;

  if (
    command &&
    global.maintenance &&
    global.owners.includes(message.author.id) === false
  ) {
    return client.send("*Command is in progress, you can't use cmd Now*", {
      message,
    });
  }
  if (command.args && !args.length) {
    if (!args.length > 0) {
      message.delete().catch(() => {});
    }
    return client.send(
      `You didn't provide any arguments, ${
        message.author
      }!\nThe proper usage would be: \n\`\`\`html\n${
        command.usage || "No Usage"
      }\n\`\`\`Description:\`\`\`html\n${
        command.description || "No Description"
      }\n\`\`\``,
      { message, timeout: 13000 }
    );
  }
  if (command.ownerOnly) {
    if (global.owners.includes(message.author.id) === false) {
      return client.send(`Only Bot Developer can use this command!*`, {
        message,
      });
    }
  }
  if (command.supportOnly) {
    if (global.owners.includes(message.author.id) === false) {
      return client.send(
        `You don't support our server, please join our server so you can access this command`,
        { message }
      );
    }
  }
  if (command.botPermissions) {
    const Permissions = command.botPermissions
      .filter((x) => !message.guild.me.permissions.has(x))
      .map((x) => "`" + x + "`");
    if (Permissions.length)
      return client.send(
        `I need ${Permissions.join(
          ", "
        )} permission(s) to execute the command!`,
        { message }
      );
  }

  if (command.authorPermissions) {
    const Permissions = command.authorPermissions
      .filter((x) => !message.member.permissions.has(x))
      .map((x) => "`" + x + "`");
    if (Permissions.length)
      return client.send(
        `You need ${Permissions.join(
          ", "
        )} permission(s) to execute this command!`,
        { message }
      );
  }
  if (command) {
    try {
      command
        .run(client, message, args)
        .then(
          console.log(
            chalk.cyan("[ INFORMATION ]") +
              chalk.white.bold(" | ") +
              chalk.blue(`${new Date().toLocaleDateString()}`) +
              chalk.white.bold(" | ") +
              chalk.cyan("Command Info") +
              chalk.white.bold(" | ") +
              chalk.blue(message.author.username) +
              chalk.white(": ") +
              chalk.greenBright(command.name)
          )
        )
        .catch((e) => {
          console.log(e);
          const errrr = new global.MessageEmbed()
            .setColor("RED")
            .setTimestamp()
            .setDescription(
              `Something went wrong executing that command\nError Message: \`\`\`\n${
                e.message ? e.message : e
              }\n\`\`\``
            );
          return message.channel
            .send({ embeds: [errrr], ephemeral: true })
            .then((m) => {
              setTimeout(() => m.delete(), 13000);
            })
            .catch((e) => {
              null;
            });
        });
    } catch (error) {
      const errrr = new global.MessageEmbed()
        .setColor("RED")
        .setTimestamp()
        .setDescription(
          `Something went wrong executing that command\nError Message: \`${
            error.message ? error.message : error
          }\``
        );
      return message.channel
        .send({ embeds: [errrr], ephemeral: true })
        .then((m) => {
          setTimeout(() => m.delete(), 13000);
        })
        .catch((e) => {
          null;
        });
    }
  }
});
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
