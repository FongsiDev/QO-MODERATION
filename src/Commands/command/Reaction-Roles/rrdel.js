const emojis = require("../../../Others/emoji");
module.exports = new global.builder()
  .setName("rrdel")
  .setCategory("Reaction-Roles")
  .setUsage(
    "rrdel [channel mention | channelID] [messageID] [role mention | roleID] [emoji | emoji animation]"
  )
  .setUserPerms(["VIEW_CHANNEL", "MANAGE_GUILD", "MANAGE_ROLES"])
  .setBotPerms([
    "VIEW_CHANNEL",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "MANAGE_ROLES",
  ])
  .setRun(async (client, message, args) => {
    let channel = await client.awaitReply(
      "Hey, Give Channel mention or channel id to determine where the reaction is!\n> *`[channel mention | channelID]`*",
      { message }
    );
    let ch = client.resolveChannel(channel);
    if (!ch)
      return client.send(
        `${await client.emoji(
          "Error"
        )} Sorry I couldn't find this channel, please see the channel or check the permissions on the channel!`,
        { message, timeout: 10000 }
      );
    let msg = await client.awaitReply(
      `Ok I will see the mesaage on channel ${ch} now give me the message id for the react\n> *\`[messageID]\`*`,
      { message }
    );
    let msg_ = await ch.messages.fetch(msg).catch(() => {});
    if (!msg_)
      return client.send(
        `${await client.emoji(
          "Error"
        )} Sorry, I didn't find the message id according to the message on the channel, please check the channel location or message id again!`,
        { message, timeout: 10000 }
      );
    let role = await client.awaitReply(
      "I found the message, woohoo. now give me a role if the member reacts\n> *`[role mention | roleID]`*",
      { message }
    );
    let rls = await client.resolveRole(role, message.guild);
    if (!rls)
      return client.send(
        `${await client.emoji(
          "Error"
        )} Ah!! I can't find the role you gave, please check again and try again!`,
        { message, timeout: 10000 }
      );
    let emoji = await client.awaitReply(
      "Alright, now the role for emojis to get access to, give them the default emoji or the nitro emoji (Only in this guild)\n> *`[emoji | emoji animation]`*",
      { message }
    );
    let emoji_ = await global.Discord.Util.parseEmoji(emoji);
    if (!emoji_ && !emojis.includes(emoji))
      return client.send(`${await client.emoji("Error")} | **Invalid Emoji**`, {
        message,
        timeout: 10000,
      });
    if (emoji_ && !emojis.includes(emoji)) {
      let checking = await client.emojis.cache.find((x) => x.id === emoji_.id);
      if (!checking)
        return client.send(
          `${await client.emoji("Error")} | **Invalid Emoji**`,
          { message, timeout: 10000 }
        );
    }
    let pog = await client.db.get(`reactions_${message.guild.id}_${msg_.id}`);
    if (pog) {
      let data = pog.find((x) => x.emoji == emoji);
      let embed = new global.MessageEmbed();
      embed.setAuthor(message.guild.name, message.guild.iconURL());
      embed.setTitle("Error");
      embed.setDescription(
        `${await client.emoji("Error")} | **Reaction Roles not Found!**`
      );
      embed.setFooter(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      );
      embed.setTimestamp();
      embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
      if (!data)
        return client.send(null, { embed: [embed], timeout: 10000, message });
      let index = pog.indexOf(data);
      delete pog[index];
      var filter = pog.filter((x) => {
        return x !== null && x;
      });
      client.db.set(`reactions_${message.guild.id}_${msg.id}`, filter);
      let embed2 = new global.MessageEmbed();
      embed2.setAuthor(message.author.tag, message.author.displayAvatarURL());
      embed2.setDescription(
        `${await client.emoji(
          "Success"
        )} **The Reaction Role has been deleted!** `
      );
      embed2.setFooter(message.guild.name, message.guild.iconURL());
      embed2.setColor("GREEN");
      embed2.setTimestamp();
      return client.send(null, { embed: [embed2], timeout: 10000, message });
    } else {
      let embed = new global.MessageEmbed();
      embed.setAuthor(message.guild.name, message.guild.iconURL());
      embed.setTitle("Error");
      embed.setDescription(
        `${await client.emoji("Error")} | **Reaction Roles not Found!**`
      );
      embed.setFooter(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      );
      embed.setTimestamp();
      embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
      client.send(null, { embed: [embed], timeout: 10000, message });
    }
  });
