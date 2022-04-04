module.exports = new global.builder()
  .setName("create-embed")
  .setDescription(
    "create a embed a command in a certain channel. supports embed!"
  )
  .setCategory("Admin")
  .setBotPerms(["MANAGE_MESSAGES", "VIEW_CHANNELS"])
  .setUserPerms(["MANAGE_MESSAGES"])
  .setArgs(true)
  .setUsage("create-embed <channel>")
  .setRun(async (client, message, args) => {
    let channel = client.resolveChannel(args[0]);
    if (!channel)
      return message.reply({
        content: "឵",
        embeds: [
          new global.MessageEmbed()
            .setColor("GOLD")
            .setDescription(
              "Please provide a **valid** channel to send the embed"
            ),
        ],
      });
    global.embed_builder.embedded(message, channel);
  });
