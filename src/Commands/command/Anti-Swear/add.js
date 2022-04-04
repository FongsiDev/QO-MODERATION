module.exports = new global.builder()
  .setName("addword")
  .setCategory("Anti-Swear")
  .setDescription("Visiting members to say rude")
  .setUserPerms(["MANAGE_MESSAGES", "VIEW_CHANNEL"])
  .setBotPerms(["MANAGE_MESSAGES", "VIEW_CHANNEL"])
  .setArgs(true)
  .setUsage("addword [Text]")
  .setRun(async (client, message, args) => {
    let pog = await client.db.get(`badword_${message.guild.id}`);
    if (
      pog && pog.badword?.find((find) => find.word == args[0])
        ? pog.badword.find((find) => find.word == args[0])
        : null
    ) {
      let embed = new global.MessageEmbed();
      embed.setAuthor(message.guild.name, message.guild.iconURL());
      embed.setTitle("Error");
      embed.setDescription(
        `${await client.emoji(
          "Error"
        )} | **The word is already on the database**`
      );
      embed.setFooter(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      );
      embed.setTimestamp();
      embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
      return client.send(null, { message, embed: [embed], timeout: 10000 });
    }
    if (pog) {
      pog.badword.push({
        word: args[0],
        author: message.author.tag,
      });
      client.db.set(`badword_${message.guild.id}`, pog);
    } else {
      client.db.set(`badword_${message.guild.id}`, {
        msg: null,
        badword: [{ word: args[0], author: message.author.tag }],
      });
    }
    let embed = new global.MessageEmbed();
    embed.setAuthor(message.guild.name, message.guild.iconURL());
    embed.setTitle("Success");
    embed.setThumbnail(message.guild.iconURL());
    embed.setDescription(`**The word has been added!**`);
    embed.setFooter(
      message.author.tag,
      message.author.displayAvatarURL({ dynamic: true })
    );
    embed.setColor("RANDOM");
    embed.setTimestamp();
    return client.send(null, { message, embed: [embed], timeout: 10000 });
  });
