module.exports = new global.SlashCommandBuilder()
  .setName("g-delete")
  .setDescription("Delete a giveaway 🎁")
  .addStringOption((options) =>
    options
      .setName("giveaway")
      .setDescription("The giveaway to delete (message ID or prize)")
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
    client.giveawaysManager
      .delete(giveaway.messageId)
      .then(() => {
        client.send("Giveaway delete!", { interaction, ephemeral: true });
      })
      .catch((e) => {
        client.send(e, {
          ephemeral: true,
          interaction,
        });
      });
  });
