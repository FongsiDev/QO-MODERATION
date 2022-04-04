module.exports = new global.SlashCommandBuilder()
  .setName("g-resume")
  .setDescription("Resume a giveaway 🎁")
  .addStringOption((options) =>
    options
      .setName("giveaway")
      .setDescription("The giveaway to resume (message ID or prize)")
      .setRequired(true)
  )
  .setUserPerms(["MANAGE_GUILD"])
  .setRun(async (interaction, client) => {
    const query = interaction.options.getString("giveaway");
    const giveaway =
      client.giveawaysManager.giveaways.find(
        (g) => g.prize === query && g.guildId === interaction.guild.id
      ) ||
      client.giveawaysManager.giveaways.find(
        (g) => g.messageId === query && g.guildId === interaction.guild.id
      );
    if (!giveaway) {
      return client.send("Unable to find a giveaway for `" + query + "`.", {
        ephemeral: true,
        interaction,
      });
    }
    if (giveaway.ended) {
      return client.send("This giveaway has ended!", {
        ephemeral: true,
        interaction,
      });
    }
    client.giveawaysManager
      .unpause(giveaway.messageId)
      .then(() => {
        client.send("Giveaway resume!", { interaction, ephemeral: true });
      })
      .catch((e) => {
        client.send(e, {
          ephemeral: true,
          interaction,
        });
      });
  });
