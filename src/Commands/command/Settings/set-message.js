let Levels = "";
module.exports = new global.builder()
  .setName("set-message")
  .setDescription("Set Message Welcome, level and others")
  .setCategory("settings")
  .setUserPerms(["MANAGE_GUILD"])
  .setBotPerms(["MANAGE_CHANNELS"])
  .setRun(async (client, message, args) => {
    let embed = new global.MessageEmbed()
      .setColor("GREEN")
      .setDescription("Choose, Which one do you want to set?")
      .setFooter(client.user.username + ` |`)
      .setTimestamp();
    let buts = new global.MessageActionRow().addComponents(
      new global.MessageSelectMenu()
        .setCustomId("opt")
        .setPlaceholder("Click Here")
        .addOptions([
          { label: "Welcome", value: "Welcome", description: "" },
          { label: "Leave", value: "Leave", description: "" },
          { label: "Anti Swear", value: "badword", description: "" },
        ])
    );
    let msg = await message.channel.send({
      embeds: [embed],
      components: [buts],
    });
    let filter = (i) => i.user.id === message.author.id;
    let filter2 = (i) => i.author.id === message.author.id;
    let col = msg.createMessageComponentCollector({
      filter,
    });
    col.on("collect", async (i) => {
      if (i.values[0] === "Welcome") {
        embed
          .setDescription(
            `Please Specify A Message To Be Set In ${i.values[0]}!`
          )
          .addField(
            `${i.values[0]} Variables`,
            `**{user}** - Mentions The User On Join.
**{username}** - Member Username With Tag!
**{server}** - Gives Server Name.
**{membercount}** - Gets Server Member Count.
**{member_at}** - View the time a member created an account.
**{position} ** - Seeing the position of members entering this server.
**{member_join}** - See when members join the server.
**{:emoji}** - Show a server emoji by replacing with name. Ex. \`{:Alix}\``
          )
          .setFooter(client.user.username + ` | ${i.values[0]} | 20 minute!`)
          .setTimestamp();
        msg.edit({ embeds: [embed], components: [] });
        let d1 = await msg.channel.awaitMessages({
          filter: filter2,
          max: 1,
        });
        d1.first().delete;
        let msg1 = d1.first().content;
        let data = await client.db.get(`welcome_${message.guild.id}`);
        if (!data) {
          client.db.set(`welcome_${message.guild.id}`, {
            msg: msg1,
            channel: null,
            nickname: null,
            roles: [],
          });
        } else {
          data.msg = msg1;
          client.db.set(`welcome_${message.guild.id}`, data);
        }
        let embeds = new global.MessageEmbed()
          .setColor("#00FF00")
          .setTitle((await client.emoji("Success")) + " Welcome Message Seted!")
          .setDescription(`Previous\n\`\`\`\n${msg1}\n\`\`\``);
        if (msg1) {
          msg1 = msg1.replace(/{user}/g, message.author);
          msg1 = msg1.replace(/{server}/g, message.guild.name);
          msg1 = msg1.replace(/{position}/g, "1");
          msg1 = msg1.replace(/{membercount}/g, message.guild.memberCount);
          msg1 = msg1.replace(/{username}/g, message.author.tag);
          msg1 = msg1.replace(
            /{member_join}/g,
            `<t:${Math.floor(message.member.joinedTimestamp / 1000)}:R>`
          );
          msg1 = msg1.replace(
            /{member_at}/g,
            `<t:${Math.floor(message.member.user.createdTimestamp / 1000)}:R>`
          );
          let matches = msg1.match(/{:([a-zA-Z0-9]+)}/g);
          if (!matches) matches = msg1;
          for (const match of matches) {
            const rep = await msg.guild.emojis.cache.find(
              (emoji) => emoji.name === match.substring(2, match.length - 1)
            );
            if (rep) msg1 = msg1.replace(match, rep);
          }
        }
        embeds
          .addField("Welcome Message Seted As", msg1)
          .setFooter("This Are For Example!");
        msg.edit({ embeds: [embeds], components: [] });
      }
      if (i.values[0] === "Leave") {
        embed
          .setDescription(
            `Please Specify A Message To Be Set In ${i.values[0]}!`
          )
          .addField(
            `${i.values[0]} Variables`,
            `**{user}** - Mentions The User On Join.
**{username}** - Member Username With Tag!
**{server}** - Gives Server Name.
**{membercount}** - Gets Server Member Count.
**{member_leave}** - See when members leave the server.
**{:emoji}** - Show a server emoji by replacing with name. Ex. \`{:Alix}\``
          )
          .setFooter(client.user.username + ` | ${i.values[0]} | 20 minute!`)
          .setTimestamp();
        msg.edit({ embeds: [embed], components: [] });
        let d1 = await msg.channel.awaitMessages({
          filter: filter2,
          max: 1,
        });
        d1.first().delete;
        let msg1 = d1.first().content;
        let data = await client.db.get(`leave_${message.guild.id}`);
        if (!data) {
          client.db.set(`leave_${message.guild.id}`, {
            msg: msg1,
            channel: null,
          });
        } else {
          data.msg = msg1;
          client.db.set(`leave_${message.guild.id}`, data);
        }
        let embeds = new global.MessageEmbed()
          .setColor("#00FF00")
          .setTitle((await client.emoji("Success")) + " Leave Message Seted!")
          .setDescription(`Previous\n\`\`\`\n${msg1}\n\`\`\``);
        if (msg1) {
          msg1 = msg1.replace(/{user}/g, message.author);
          msg1 = msg1.replace(/{server}/g, message.guild.name);
          msg1 = msg1.replace(/{membercount}/g, message.guild.memberCount);
          msg1 = msg1.replace(/{username}/g, message.author.tag);
          msg1 = msg1.replace(
            /{member_leave}/g,
            `<t:${Math.floor(Date.now() / 1000)}:R>`
          );
          let matches = msg1.match(/{:([a-zA-Z0-9]+)}/g);
          if (!matches) matches = msg1;
          for (const match of matches) {
            const rep = await msg.guild.emojis.cache.find(
              (emoji) => emoji.name === match.substring(2, match.length - 1)
            );
            if (rep) msg1 = msg1.replace(match, rep);
          }
        }
        embeds
          .addField("Leave Message Seted As", msg1)
          .setFooter("This Are For Example!");
        msg.edit({ embeds: [embeds], components: [] });
      }
      if (i.values[0] === "badword") {
        embed
          .setDescription(
            `Please Specify A Message To Be Set In ${i.values[0]}!`
          )
          .addField(
            `${i.values[0]} Variables`,
            `**{user}** - Mentions The User On Join.
**{username}** - Member Username With Tag!
**{server}** - Gives Server Name.
**{:emoji}** - Show a server emoji by replacing with name. Ex. \`{:Alix}\``
          )
          .setFooter(client.user.username + ` | ${i.values[0]} | 20 minute!`)
          .setTimestamp();
        msg.edit({ embeds: [embed], components: [] });
        let d1 = await msg.channel.awaitMessages({
          filter: filter2,
          max: 1,
        });
        d1.first().delete;
        let msg1 = d1.first().content;
        let data = await client.db.get(`badword_${message.guild.id}`);
        if (!data) {
          client.db.set(`badword_${message.guild.id}`, {
            msg: msg1,
            badword: [],
          });
        } else {
          data.msg = msg1;
          client.db.set(`badword_${message.guild.id}`, data);
        }
        let embeds = new global.MessageEmbed()
          .setColor("#00FF00")
          .setTitle((await client.emoji("Success")) + " Badword Message Seted!")
          .setDescription(`Previous\n\`\`\`\n${msg1}\n\`\`\``);
        if (msg1) {
          msg1 = msg1.replace(/{user}/g, message.author);
          msg1 = msg1.replace(/{server}/g, message.guild.name);
          msg1 = msg1.replace(/{username}/g, message.author.tag);
          let matches = msg1.match(/{:([a-zA-Z0-9]+)}/g);
          if (!matches) matches = msg1;
          for (const match of matches) {
            const rep = await msg.guild.emojis.cache.find(
              (emoji) => emoji.name === match.substring(2, match.length - 1)
            );
            if (rep) msg1 = msg1.replace(match, rep);
          }
        }
        embeds
          .addField("Badword Message Seted As", msg1)
          .setFooter("This Are For Example!");
        msg.edit({ embeds: [embeds], components: [] });
      }
    });
  });
