module.exports = new global.SlashCommandBuilder()
  .setName("g-list")
  .setDescription("List a giveaway 🎁")
  .setRun(async (interaction, client) => {
    let giveaways = await client.giveawaysManager.giveaways
      .filter((g) => g.guildId === interaction.guildId)
      .map((g, i) => {
        return `\`${i + 1}\` [Giveaway ${i + 1}](${g.messageURL}) ${
          g.hostedBy
        }`;
      });
    client.send(null, {
      embed: [
        new global.MessageEmbed()
          .setColor("RANDOM")
          .setTitle(`** All Giveaways of ${interaction.guild.name} **`)
          .setDescription(giveaways.join("\n\n").substr(0, 3000))
          .setFooter({
            text: `Copyright By Fongsi`,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
          }),
      ],
      interaction,
    });
  });
