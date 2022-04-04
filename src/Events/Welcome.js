module.exports = (client) => {
  client.on("guildMemberAdd", async (member) => {
    /*let role = await client.db.get(`wel_role_${member.guild.id}`);
    let msg = await client.db.get(`wel_message_${member.guild.id}`);
    let chn = await client.db.get(`wel_channel_${member.guild.id}`);
    let nick = await client.db.get(`wel_nickname_${member.guild.id}`);
   */
    let welcome = await client.db.get(`welcome_${member.guild.id}`);
    let chn = welcome?.channel ? welcome.channel : null;
    let msg = welcome?.msg ? welcome.msg : null;
    let nick = welcome?.nickname ? welcome.nickname : null;
    let roles = welcome?.roles ? welcome.roles : null;
    let channel = client.resolveChannel(chn);
    if (!channel) return;
    let joinPosition;
    const members = member.guild.members.cache
      .sort((a, b) => a.joinedAt - b.joinedAt)
      .map((x) => x);
    for (let i = 0; i < members.length; i++) {
      if (members[i] == member.guild.members.cache.get(member.id).id)
        joinPosition = i;
    }
    if (!msg) msg = "Welcome To {server}, {username} 😀";
    if (msg) {
      msg = msg.replace(/{user}/g, member);
      msg = msg.replace(/{username}/g, member.user.tag);
      msg = msg.replace(/{membercount}/g, member.guild.memberCount);
      msg = msg.replace(/{server}/g, member.guild.name);
      msg = msg.replace(/{position}/g, joinPosition || 1);
      msg = msg.replace(
        /{member_join}/g,
        `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
      );
      msg = msg.replace(
        /{member_at}/g,
        `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`
      );
      let matches = msg.match(/{:([a-zA-Z0-9]+)}/g);
      if (!matches) matches = msg;
      for (const match of matches) {
        const rep = await member.guild.emojis.cache.find(
          (emoji) => emoji.name === match.substring(2, match.length - 1)
        );
        if (rep) msg = msg.replace(match, rep);
      }
    }
    const Embed = new global.MessageEmbed()
      .setColor("BLUE")
      .setDescription(msg);
    channel.send({ embeds: [Embed] });
  });
  client.on("guildMemberRemove", async (member) => {
    /*let msg = await client.db.get(`lev_message_${member.guild.id}`);
    let chn = await client.db.get(`lev_channel_${member.guild.id}`);
    */
    let leave = await client.db.get(`welcome_${member.guild.id}`);
    let chn = leave?.channel ? leave.channel : null;
    let msg = leave?.message ? leave.message : null;
    let channel = client.resolveChannel(chn);
    if (!channel) return;
    if (!msg)
      msg =
        "Oh no, the {username} left this server, sorry if you don't like it";
    if (msg) {
      msg = msg.replace(/{user}/g, member);
      msg = msg.replace(/{username}/g, member.user.tag);
      msg = msg.replace(/{membercount}/g, member.guild.memberCount);
      msg = msg.replace(/{server}/g, member.guild.name);
      let matches = msg.match(/{:([a-zA-Z0-9]+)}/g);
      if (!matches) matches = msg;
      for (const match of matches) {
        const rep = await member.guild.emojis.cache.find(
          (emoji) => emoji.name === match.substring(2, match.length - 1)
        );
        if (rep) msg = msg.replace(match, rep);
      }
    }
    const Embed = new global.MessageEmbed().setColor("RED").setDescription(msg);
    channel.send({ embeds: [Embed] });
  });
};
