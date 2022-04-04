module.exports = new global.SlashCommandBuilder()
  .setName("ping")
  .setDescription("Check ping from bot")
  .setRun(async (interaction, client) => {
    const embed = new global.MessageEmbed()
      .setColor("RED")
      .setTitle("PONG! 🟢")
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        {
          name: "Latency",
          value: `\`${Date.now() - interaction.createdTimestamp}ms\``,
        },
        { name: "API Latency", value: `\`${Math.round(client.ws.ping)}ms\`` }
      );
    client.send(null, { embed: [embed], interaction });
  });
