module.exports = new global.SlashCommandBuilder()
  .setName("mute")
  .setDescription("Muted a user from the server")
  .setUserPerms(["MANAGE_ROLES"])
  .setBotPerms(["MANAGE_ROLES"])
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to muted").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for the muted")
      .setRequired(false)
  )
  .setRun(async (interaction, client, data) => {
    let member = interaction.options.getMember("user");
    let reason =
      interaction.options.getString("reason") || "There is no definite reason";
    let time = interaction.options.getString("time");
    if (!member?.user.id ? true : false) {
      return client.send("User Is Not In The Guild!", {
        ephemeral: true,
        interaction,
      });
    } else if (member.user.id === interaction.user.id) {
      return client.send("You can't moderate yourself!", {
        ephemeral: true,
        interaction,
      });
    } else if (member.user.id === client.user.id) {
      return client.send("You can't moderate me!", {
        ephemeral: true,
        interaction,
      });
    } else if (member.user.id === interaction.guild.ownerId) {
      return client.send("You can't moderate the server owner!", {
        ephemeral: true,
        interaction,
      });
    }
    if (
      interaction.member.roles.highest.position < member.roles.highest.position
    ) {
      return client.send(
        "You can't muted someone with a higher role than you!",
        {
          ephemeral: true,
          interaction,
        }
      );
    }

    let muterole;
    let dbmute = await client.db.get(`muterole_${interaction.guild.id}`);
    let memberrole = interaction.guild.roles.cache.find(
      (r) => r.name === "QO MUTED"
    );

    if (!interaction.guild.roles.cache.has(dbmute)) {
      muterole = memberrole;
    } else {
      muterole = interaction.guild.roles.cache.get(dbmute);
    }
    const userRoles = member.roles.cache
      .filter((r) => r.id !== interaction.guild.id)
      .map((r) => r.id);
    if (!muterole) {
      try {
        muterole = await interaction.guild.roles.create({
          name: "QO MUTED",
          color: "#514f48",
          permissions: [],
        });
        interaction.guild.channels.cache.map(async (channel) => {
          await channel.permissionOverwrites.create(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            SPEAK: false,
            CONNECT: false,
          });
        });
      } catch (e) {
        console.log(e);
      }
    }
    if (member.roles.cache.has(muterole.id))
      return client.send("**User Is Already Muted!**", {
        interaction,
        ephemeral: true,
      });
    client.db.set(`memberid_${interaction.guild.id}_${member.id}`, userRoles);
    try {
      const sembed2 = new interactionEmbed()
        .setColor("RED")
        .setDescription(
          `**You Have Been muted From ${interaction.guild.name} for ${reason} Muted by ${interaction.user.username}**`
        )
        .setFooter(interaction.guild.name, interaction.guild.iconURL());
      member
        .send({ embeds: [sembed2] })
        .then(async () => {
          await member.roles.set([muterole.id]).then(async () => {
            if (data.modLogs) {
              let modChannel = await interaction.guild.channels.fetch(
                data.modLogs
              );
              if (modChannel) {
                let embed = new interactionEmbed()
                  .setAuthor({
                    name: `${interaction.user.username} ${
                      interaction.member.nickname
                        ? `(${interaction.member.nickname})`
                        : ""
                    }`,
                    iconURL: `${interaction.user.avatarURL()}`,
                  })
                  .setTitle("User Muted")
                  .setColor("#2f3136")
                  .setDescription(`Reason: ${reason}`)
                  .addFields(
                    { name: "User", value: `${member}`, inline: true },
                    {
                      name: "Moderator",
                      value: `${interaction.member}`,
                      inline: true,
                    }
                  )
                  .setTimestamp();
                modChannel.send({ embeds: [embed] });
              }
            }

            return client.send(
              `${member} has been Muted! Reason: **${reason}**`,
              {
                interaction,
              }
            );
          });
        })
        .catch(() => null);
    } catch {
      await member.roles.set([muterole.id]).then(async () => {
        if (data.modLogs) {
          let modChannel = await interaction.guild.channels.fetch(data.modLogs);
          if (modChannel) {
            let embed = new interactionEmbed()
              .setAuthor({
                name: `${interaction.user.username} ${
                  interaction.member.nickname
                    ? `(${interaction.member.nickname})`
                    : ""
                }`,
                iconURL: `${interaction.user.avatarURL()}`,
              })
              .setTitle("User Muted")
              .setColor("#2f3136")
              .setDescription(`Reason: ${reason}`)
              .addFields(
                { name: "User", value: `${member}`, inline: true },
                {
                  name: "Moderator",
                  value: `${interaction.member}`,
                  inline: true,
                }
              )
              .setTimestamp();
            modChannel.send({ embeds: [embed] });
          }
        }
        return client.send(`${member} has been Muted! Reason: **${reason}**`, {
          interaction,
        });
      });
    }
  });
