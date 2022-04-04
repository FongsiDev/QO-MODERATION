const moment = require("moment");

module.exports = new global.builder()
  .setName("userinfo")
  .setAliases(["whois", "user"])
  .setUsage("userinfo <MENTION/ID>")
  .setCategory("Misc")
  .setDescription("Get advance stats of given person or yourself")
  .setRun(async (client, message, args) => {
    let user = await client.resolveMember(args[0], message.guild);
    if (!user)
      user = await client.resolveMember(message.author.id, message.guild);
    // Format Permissions
    const permissions = user.permissions.toArray().map((perm) => {
      return perm
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    });

    // Calculate Join Position
    let joinPosition;
    const members = message.guild.members.cache
      .sort((a, b) => a.joinedAt - b.joinedAt)
      .map((x) => x);
    for (let i = 0; i < members.length; i++) {
      if (members[i] == message.guild.members.cache.get(user.id).id)
        joinPosition = i;
    }
    //OPTIONS FOR STATUS
    let stat = {
      online: "https://emoji.gg/assets/emoji/9166_online.png",
      idle: "https://emoji.gg/assets/emoji/3929_idle.png",
      dnd: "https://emoji.gg/assets/emoji/2531_dnd.png",
      offline: "https://emoji.gg/assets/emoji/7445_status_offline.png",
    };
    const emoji = {
      STAFF: await client.emoji("Employee"),
      PARTNER: await client.emoji("Partner"),
      HYPESQUAD: await client.emoji("Hypesquad"),
      HYPESQUAD_ONLINE_HOUSE_2: await client.emoji("HypesquadBrillance"),
      HYPESQUAD_ONLINE_HOUSE_1: await client.emoji("HypesquadBravery"),
      HYPESQUAD_ONLINE_HOUSE_3: await client.emoji("YypesquadBalance"),
      BUG_HUNTER_LEVEL_2: await client.emoji("HunterGold"),
      BUG_HUNTER_LEVEL_1: await client.emoji("Hunter"),
      PREMIUM_EARLY_SUPPORTER: await client.emoji("Support"),
      VERIFIED_DEVELOPER: await client.emoji("Developers"),
      NITRO: await client.emoji("Nitro"),
      BOOST: await client.emoji("Boosts"),
      BOT: await client.emoji("BotClassic"),
      CERTIFIED_MODERATOR: await client.emoji("DiscordCertifiedModerator"),
      VERIFIED_BOT: await client.emoji("BotVerify"),
    };
    //NOW BADGES
    let badges = await user.user.flags;
    badges = await badges.toArray();
    let newbadges = [];
    badges.forEach((m) => {
      newbadges.push(
        `${emoji[m] ? emoji[m] : "🔸"} **\`${m
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          })}\`**`
      );
    });
    let embed = new global.MessageEmbed().setThumbnail(
      user.user.displayAvatarURL({ dynamic: true })
    );
    //ACTIVITY
    let array = [];
    if (
      user.presence?.activities.length ? user.presence.activities.length : null
    ) {
      let data = user.presence.activities;

      for (let i = 0; i < data.length; i++) {
        let name = data[i].name || "None";
        let xname = data[i].details || "None";
        let zname = data[i].state || "None";
        let type = data[i].type;

        array.push(`**${type}** : \`${name} : ${xname} : ${zname}\``);

        if (data[i].name === "Spotify") {
          embed.setThumbnail(
            `https://i.scdn.co/image/${data[i].assets.largeImage.replace(
              "spotify:",
              ""
            )}`
          );
        }

        embed.setDescription(array.join("\n"));
      }
    }
    //Check Roles used by members
    let roles = user.roles.cache
      .map((r) => `<@&${r.id}>`)
      .join(", ")
      .replace(new RegExp(`<@&${message.guild.id}>`, "g"), "");
    if (roles.length === 0) roles = "-";

    //EMBED COLOR BASED ON member
    embed.setColor(
      user.displayHexColor === "#000000" ? "#ffffff" : user.displayHexColor
    );

    //OTHER STUFF
    embed.setAuthor(
      user.user.tag,
      user.user.displayAvatarURL({ dynamic: true })
    );

    //CHECK IF USER HAVE NICKNAME
    if (user.nickname !== null)
      embed.addField("Nickname", `**\`${user.nickname}\`**`);
    embed
      .addField(
        "Common Information",
        `**\`Tags: ${user.user.username}
ID: ${user.user.id}
Discriminator: ${user.user.discriminator}
Bot: ${user.user.bot ? "Yes" : "No"}
Deleted User: ${user.deleted ? "Yes" : "No"}
Joined At: ${moment(user.joinedAt).format("LLLL")}
Account Created At: ${moment(user.createdAt).format("LLLL")} (${moment(
          user.user.createdAt,
          "YYYYMMDD"
        ).fromNow()})
Position : ${joinPosition || 1}\`**`
      )
      .addField(
        "Badget",
        `${
          user.user.avatarURL({ dynamic: true }).includes("gif")
            ? `**\`${emoji.NITRO} Nitro**\`\n`
            : ""
        }` + newbadges.join("\n") || "**`None`**"
      )
      .addField("Roles", roles)
      .addField("Permissions", `**\`${permissions.join("\n")}\`**`)
      .setFooter(
        user.presence?.status ? user.presence.status : "offline",
        stat[user.presence?.status ? user.presence.status : "offline"]
      );

    return message.channel.send({ embeds: [embed] });
  });
