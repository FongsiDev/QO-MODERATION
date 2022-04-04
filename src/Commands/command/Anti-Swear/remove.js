module.exports = new global.builder()
  .setName("delword")
  .setCategory("Anti-Swear")
  .setDescription("Visiting members to say rude")
  .setUserPerms(["MANAGE_MESSAGES", "VIEW_CHANNEL"])
  .setBotPerms(["MANAGE_MESSAGES", "VIEW_CHANNEL"])
  .setArgs(true)
  .setUsage("delword [Text]")
  .setRun(async (client, message, args) => {
    let pog = await client.db.get(`badword_${message.guild.id}`);
    if (pog) {
      let data = pog.badword.find(
        (x) => x.word.toLowerCase() === args[0].toLowerCase()
      );
      let No = new global.MessageEmbed();
      No.setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      );
      No.setDescription(`:x: | **Word Not Found**`);
      No.setColor("#FF0000");
      No.setFooter(message.guild.name, message.guild.iconURL());
      No.setThumbnail(message.guild.iconURL());
      if (!data) return message.channel.send({ embeds: [No] });
      let yes = pog.badword.indexOf(data);
      delete pog.badword[yes];
      var filter = pog.badword.filter((x) => {
        return x != null && x != "";
      });
      client.db.set(`badword_${message.guild.id}`, {
        msg: pog.msg,
        badword: filter,
      });
      let embed = new global.MessageEmbed();
      embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
      embed.setDescription(`**The word has been deleted!** `);
      embed.setFooter(message.guild.name, message.guild.iconURL());
      embed.setColor("GREEN");
      embed.setTimestamp();
      return message.channel.send({ embeds: [embed] });
    } else {
      let embed = new global.MessageEmbed();
      embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
      embed.setDescription(`:x: | **The word was not found!**`);
      embed.setFooter(message.guild.name, message.guild.iconURL());
      embed.setColor("#FF0000");
      embed.setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }
  });
