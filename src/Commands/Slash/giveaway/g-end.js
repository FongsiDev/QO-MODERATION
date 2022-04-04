module.exports = new global.SlashCommandBuilder()
  .setName("g-end")
  .setDescription("End a giveaway 🎁")
  .addStringOption((options) =>
    options
      .setName("giveaway")
      .setDescription("The giveaway to end (message ID or prize)")
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
      return client.send("This giveaway is already ended!", {
        ephemeral: true,
        interaction,
      });
    }
    client.giveawaysManager
      .end(giveaway.messageId)
      .then(() => {
        client.send("Giveaway ended!", { interaction, ephemeral: true });
      })
      .catch((e) => {
        client.send(e, {
          ephemeral: true,
          interaction,
        });
      });
  });
