module.exports = new global.SlashCommandBuilder()
  .setName("nuke")
  .setDescription("Delete all the messages in a channel")
  .setUserPerms(["MANAGE_CHANNELS"])
  .setBotPerms(["MANAGE_CHANNELS"])
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Select channel for nuke")
      .setRequired(false)
  )
  .setRun(async (interaction, client) => {
    let channel = client.resolveChannel(
      interaction.options.getChannel("channel")?.id
        ? interaction.options.getChannel("channel").id
        : interaction.channel.id
    );
    if (channel.type !== "GUILD_TEXT") {
      return client.send("Text Channel Only!", { interaction });
    }
    channel
      .delete()
      .then(async (x) => {
        const position = channel.position;
        const topic = channel.topic;
        const channel2 = await channel.clone();
        channel2.setPosition(position);
        channel2.setTopic(topic);
        client.send("Successfully Nuke the channel", { interaction });
        return channel2.send({
          embeds: [
            {
              author: {
                icon_url: interaction.user.displayAvatarURL({
                  dynamic: true,
                }),
                name: interaction.user.username,
              },
              description: ":boom: **Channel Has Been Nuked!**",
              color: "GREEN",
              timestamp: new Date(),
            },
          ],
        });
      })
      .catch((x) => {
        return client.send(x?.message ? x.message : x, { interaction });
      });
  });
