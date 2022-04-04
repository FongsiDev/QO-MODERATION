module.exports = async (client) => {
  client.on("messageCreate", async (message) => {
    if (!message.guild || message.webhookID) return;
    let words = await client.db.get(`badword_${message.guild.id}`);
    let msg = words?.msg ? words.msg : null;
    if (msg === null) {
      msg = ":x: | **{user}, The Word You said is blacklisted!**";
    }
    let Prefix = global.gprefix || global.prefix;
    if (message.content.startsWith(Prefix + "addword")) return;
    if (message.content.startsWith(Prefix + "delword")) return;
    if (msg) {
      msg = msg.replace(/{user}/g, message.author);
      msg = msg.replace(/{server}/g, message.guild.name);
      msg = msg.replace(/{username}/g, message.author.tag);
      let matches = msg.match(/{:([a-zA-Z0-9]+)}/g);
      if (!matches) matches = msg;
      for (const match of matches) {
        const rep = await message.guild.emojis.cache.find(
          (emoji) => emoji.name === match.substring(2, match.length - 1)
        );
        if (rep) msg = msg.replace(match, rep);
      }
    }
    if (words === null) return;
    function check(msg) {
      return words?.badword
        ? words.badword.some((word) =>
            message.content
              .toLowerCase()
              .split(" ")
              .join("")
              .includes(word.word.toLowerCase())
          )
        : null;
    }
    if (check(message.content) === true) {
      message.delete();
      client.send(msg, { message, timeout: 5000 });
    }
  });
};
