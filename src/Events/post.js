let channel_post = "948630264437944411";
let channel_get = "954585798160822282";

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.channel.id === channel_get) {
      client.channels.cache
        .get(channel_post)
        .send({ content: message.content, components: [] })
        .then((x) => {
          x.react("954526726698987581");
          x.react("954528313517428757");
        });
    }
  });
  client.on("messageDelete", async (message) => {
    if (!message.content) return;
    if (message.author.bot) return;
    if (message.channel.id === channel_get) {
      client.channels.cache
        .get(channel_post)
        .messages.fetch()
        .then((x) => {
          x.find((x) => x.content === message.content && x.author.bot).delete();
        });
    }
  });
  client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (oldMessage.content) {
      if (oldMessage.author.bot) return;
      if (oldMessage.content === newMessage.content) return;
      if (oldMessage.channel.id === channel_get) {
        client.channels.cache
          .get(channel_post)
          .messages.fetch()
          .then((x) => {
            x.find((x) => x.content === oldMessage.content && x.author.bot)
              .edit({
                content: `${newMessage}`,
              })
              .catch(() => {
                null;
              });
          });
      }
    } else {
      if (oldMessage.reactions.message.author.bot) return;
      if (oldMessage.reactions.message.content === newMessage.content) return;
      if (oldMessage.channel.id === channel_get) {
        client.channels.cache
          .get(channel_post)
          .messages.fetch()
          .then((x) => {
            x.find(
              (x) =>
                x.content === oldMessage.message.reactions.content &&
                x.author.bot
            )
              .edit({
                content: `${newMessage}`,
              })
              .catch(() => {
                null;
              });
          });
      }
    }
  });
  client.on("messageReactionAdd", async (reaction, user) => {
    await reaction.fetch();
    if (user.bot) return;
    if (reaction.emoji.id === "954528313517428757") {
      const fetchMsg = await reaction.message.fetch();
      if (fetchMsg.author.id === client.user.id) {
        let user_ = await fetchMsg.reactions.cache
          .get("954528313517428757")
          .users.fetch()
          .then((x) =>
            x.filter((u) => !u.bot).filter((u) => u.id === "678106287820505089")
          );
        if (user_) {
          fetchMsg.delete();
        }
      }
    }
  });
};
