module.exports = new global.builder()
  .setName("set-ticket")
  .setDescription("setup a ticket System")
  .setCategory("Settings")
  .setUserPerms(["MANAGE_CHANNELS", "SEND_MESSAGES"])
  .setBotPerms(["MANAGE_CHANNELS", "SEND_MESSAGES"])
  .setCooldown(6000)
  .setRun(async (client, message, args) => {
    let data = await client.db.get(`ticket_${message.guild.id}`);
    const channel_category = await client.awaitReply(
      "Hey, Before showing the ticket panel, I want to ask for the channel category for the tickets that will be made there\n> Give me id category channel!",
      { message }
    );
    if (
      client.resolveChannel(channel_category) &&
      client.resolveChannel(channel_category).type === "GUILD_CATEGORY"
    ) {
      const role = await client.awaitReply(
        "Good, I have changed it to my database. I will create a new channel if a member creates a new ticket, now I ask for one more, give staff roles to view tickets and open/close!\n>Tag The role!",
        { message }
      );
      let r = client.resolveRole(role, message.guild);
      if (r) {
        if (!data) {
          client.db.set(`ticket_${message.guild.id}`, {
            role: r.id,
            channel: channel_category,
          });
        } else {
          data.channel = channel_category;
          data.role = r.id;
          client.db.set(`ticket_${message.guild.id}`, data);
        }
        client.send(
          "Done, I have changed everything to my database, and my ticket panel will send here, you need to delete this message.",
          { message }
        );
        const OpenTicket = new MessageEmbed()
          .setColor("BLUE")
          .setAuthor(
            message.guild.name,
            message.guild.iconURL({
              dynamic: true,
            }) || "https://cdn.discordapp.com/embed/avatars/0.png"
          )
          .setDescription(
            "__**How to make a ticket**__\n" +
              "> Click on the reaction that relates to your need\n" +
              "> Once the ticket is made you will be able to type in there"
          )
          .setTitle("Tickets")
          .setThumbnail(
            "https://media.discordapp.net/attachments/733317247522832445/767777222080725022/download-ticket-ticket-free-entertainment-icon-orange-ticket-design-0.png"
          );
        const row = new global.MessageActionRow().addComponents(
          new global.MessageButton()
            .setLabel("Create Ticket!")
            .setCustomId("ticket-open")
            .setEmoji("🎫")
            .setStyle("PRIMARY")
        );
        message.channel.send({
          embeds: [OpenTicket],
          components: [row],
        });
      } else {
        return client.send("Error: Invaild Roles!", { message });
      }
    } else {
      return client.send("Error: Invaild Channel Category!", { message });
    }
  });
