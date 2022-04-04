module.exports = new global.builder()
  .setName("sudo")
  .setDescription("Makes a webhook to impersonate someone")
  .setArgs(true)
  .setCategory("Utility")
  .setBotPerms(["MANAGE_WEBHOOKS"])
  .setRun(async (client, message, args) => {
    message.delete();
    let user = await client.resolveMember(args[0]);
    if (!user) return client.send("Please provide a user!", { message });
    const webhook = await message.channel.createWebhook(user.displayName, {
      avatar: user.user.displayAvatarURL(),
      channel: message.channel.id,
    });
    await webhook
      .send({
        content: args.slice(1).join(" "),
        avatarURL: user.user.displayAvatarURL(),
      })
      .then(() => {
        webhook.delete();
      });
  });
