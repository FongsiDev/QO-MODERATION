module.exports = new global.SlashCommandBuilder()
  .setName("g-drop")
  .setDescription("Create a drop giveaway 🎁")
  .addIntegerOption((options) =>
    options
      .setName("winners")
      .setDescription("How many winners the giveaway should have")
      .setRequired(true)
  )
  .addStringOption((options) =>
    options
      .setName("prize")
      .setDescription("What the prize of the giveaway should be")
      .setRequired(true)
  )
  .addChannelOption((options) =>
    options
      .setName("channel")
      .setDescription("The channel to start the giveaway in")
      .setRequired(true)
  )
  .setUserPerms(["MANAGE_GUILD"])
  .setRun(async (interaction, client) => {
    const giveawayChannel = interaction.options.getChannel("channel");
    const giveawayWinnerCount = interaction.options.getInteger("winners");
    const giveawayPrize = interaction.options.getString("prize");

    if (!giveawayChannel.isText()) {
      return client.send(
        (await client.emoji("Error")) + " Selected channel is not text-based.",
        {
          ephemeral: true,
          interaction,
        }
      );
    }
    client.giveawaysManager
      .start(giveawayChannel, {
        winnerCount: giveawayWinnerCount,
        prize: giveawayPrize,
        hostedBy: interaction.user || null,
        thumbnail: "https://ezzud.fr/images/closedFixed.png",
        isDrop: true,
        messages: await global.giveaway(client),
      })
      .then(() => {
        client.send(`Giveaway started in ${giveawayChannel}!`, {
          interaction,
          ephemeral: true,
        });
      })
      .catch((x) => {
        client.send(x, {
          interaction,
          ephemeral: true,
        });
      });
  });
