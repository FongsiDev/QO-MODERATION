const { readdirSync } = require("fs");
module.exports = new global.builder()
  .setName("help")
  .setDescription(
    "List all of my commands or show information about a specific command."
  )
  .setCategory("Utility")
  .setRun(async (client, message, args) => {
    const categorys = new global.Discord.Collection();
    const c_private = ["Owner"];
    const menus = [];
    let emote = {
      Utility: await client.emoji("Utility"),
    };
    readdirSync("./src/Commands/command").forEach((dir) => {
      if (c_private.includes(dir)) return;
      categorys.set(
        dir.toLowerCase(),
        `${emote[dir] || "🔸"} **\`${dir
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          })}\`** Command`
      );
      const name = `${emote[dir] || "🔸"} ${dir
        .toUpperCase()
        .split("_")
        .join(" ")}`;
      menus.push({
        label: `${dir
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          })} Category`,
        description: `${dir
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          })} Commands`,
        value: dir.toLowerCase(),
        emoji: emote[dir] || "🔸",
      });
    });
    if (args.length) {
      if (categorys.has(args[0])) {
        let embed = new global.MessageEmbed()
          .setColor("RANDOM")
          .setTimestamp()
          .setDescription(
            `${categorys.get(args[0])}\n\`\`\`xl\n${
              global.gprefix || global.prefix
            }help [Command]\n\`\`\``
          )
          .addField(
            `Commands:`,
            `${client.commands
              .filter((command) =>
                command.category.toLowerCase().includes(args[0])
              )
              .map((command) => `\`${command.name}\``)
              .join(", ")}` || `\u200b`
          )
          .setFooter(
            `Total Of: - ${
              client.commands.filter((command) =>
                command.category.toLowerCase().includes(args[0])
              ).size
            } Commands`,
            message.author.displayAvatarURL({
              dynamic: true,
            })
          );
        return message.channel.send({ embeds: [embed] });
      }
    }
    const command =
      client.commands.get(args[0]) ||
      client.commands.find((c) => c.aliases && c.aliases.includes(args[0]));
    if (!command) {
    } else {
      let embed = new global.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`**\`${command.name}\`** Command`)
        .setDescription(
          `\`${command.description ? command.description : "No Description"}\``
        )

        .addField(
          `Category`,
          `• \`${command.category ? command.category : "No Category"}\``,
          true
        )
        .addField(
          `Aliases`,
          `• \`${
            command.aliases ? command.aliases.join(", ") : "No Aliases"
          }\``,
          true
        )
        .addField(
          `Required Permission`,
          `• \`${
            command.botPermissions
              ? command.botPermissions.join(", ")
              : "No Permission"
          }\``,
          false
        )
        .addField(
          `Usage`,
          `• \`${command.usage ? command.usage : "No Usage"}\``,
          false
        )
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }
    let em = new global.MessageEmbed()
      .setColor("GREEN")
      .setTitle("Choose your option!")
      .setDescription(
        `**TYPE Recommends for full list of commands\n${await client.emoji(
          "Arrow"
        )} [Support](${global.server.url})\n${await client.emoji(
          "Arrow"
        )} [Invite Me](${global.invite})\n${await client.emoji(
          "Arrow"
        )} [My Source](https://github.com/Sintya4/PREMIUM-DGH-BOT-V3)\n**`
      )
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setImage(global.image)
      .setTimestamp();
    let raw = new global.MessageActionRow().addComponents(
      new global.MessageSelectMenu()
        .setCustomId("help-menu")
        .setPlaceholder(`Choose the command category`)
        .addOptions(menus)
    );
    let button_for_owner = new global.MessageActionRow().addComponents(
      new global.MessageButton()
        .setCustomId("owner")
        .setStyle("PRIMARY")
        .setLabel("Help Owner")
        .setEmoji(await client.emoji("Owner"))
    );
    let msg;
    if (global.owners.includes(message.author.id) === true) {
      msg = await message.channel.send({
        embeds: [em],
        components: [raw, button_for_owner],
      });
    } else {
      msg = await message.channel.send({
        embeds: [em],
        components: [raw],
      });
    }
    let filter = (i) => i.user.id === message.author.id;
    let col = msg.createMessageComponentCollector({
      filter,
      time: 60000,
    });
    col.on("collect", async (i) => {
      /*if(message.author.id === i.user.id) {
    		return i.followUp({content: "Only the owner using this command has this access!", ephemeral: true})
    	} */
      if (i.customId === "owner") {
        if (global.owners.includes(i.user.id) === true) {
          let embed = new global.MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setDescription(
              `${await client.emoji(
                "Owner"
              )} **\`Owner\`** Command\n\`\`\`xl\n${
                global.gprefix || global.prefix
              }help [Command]\n\`\`\``
            )
            .addField(
              `Commands:`,
              `${client.commands
                .filter((command) =>
                  command.category.toLowerCase().includes(i.customId)
                )
                .map((command) => `\`${command.name}\``)
                .join(", ")}` || `\u200b`
            )
            .setFooter(
              `Total Of: - ${
                client.commands.filter((command) =>
                  command.category.toLowerCase().includes(i.customId)
                ).size
              } Commands`,
              message.author.displayAvatarURL({
                dynamic: true,
              })
            );
          return i.reply({ embeds: [embed], ephemeral: true });
        } else {
          return i.reply({
            embeds: [
              new global.MessageEmbed()
                .setColor("RED")
                .setTimestamp()
                .setDescription("Only Owner Bot can see commands here!"),
            ],
          });
        }
      } else if (i.customId === "help-menu") {
        if (categorys.has(i.values[0])) {
          let embed = new global.MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setDescription(
              `${categorys.get(i.values[0])}\n\`\`\`xl\n${
                global.gprefix || global.prefix
              }help [Command]\n\`\`\``
            )
            .addField(
              `Commands:`,
              `${client.commands
                .filter((command) =>
                  command.category.toLowerCase().includes(i.values[0])
                )
                .map((command) => `\`${command.name}\``)
                .join(", ")}` || `\u200b`
            )
            .setFooter(
              `Total Of: - ${
                client.commands.filter((command) =>
                  command.category.toLowerCase().includes(i.values[0])
                ).size
              } Commands`,
              message.author.displayAvatarURL({
                dynamic: true,
              })
            );
          return msg.edit({ embeds: [embed] });
        }
      }
    });
    col.on("end", async (i) => {
      raw.components[0].setDisabled(true);
      return msg.edit({ embeds: [em], components: [raw] });
    });
  });
