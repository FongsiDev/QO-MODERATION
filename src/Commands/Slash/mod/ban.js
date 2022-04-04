module.exports = new global.SlashCommandBuilder()
  .setName("ban")
  .setDescription("Bans a user from the server")
  .setUserPerms(["BAN_MEMBERS"])
  .setBotPerms(["BAN_MEMBERS"])
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to ban").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for the ban")
      .setRequired(false)
  )
  .setRun(async (interaction, client, data) => {
    let member = interaction.options.getMember("user");
    let reason =
      interaction.options.getString("reason") || "There is no definite reason";
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
        "You can't kick someone with a higher role than you!",
        {
          ephemeral: true,
          interaction,
        }
      );
    }
    if (!member.bannable) {
      return client.send("I can't ban that user!", {
        ephemeral: true,
        interaction,
      });
    }
    try {
      const sembed2 = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `**You Have Been banned From ${interaction.guild.name} for ${reason} banned by ${interaction.user.username}**`
        )
        .setFooter(interaction.guild.name, interaction.guild.iconURL());
      member
        .send({ embeds: [sembed2] })
        .then(async () => {
          await member.ban({ reason: `${reason}` }).then(async () => {
            if (data.modLogs) {
              let modChannel = await interaction.guild.channels.fetch(
                data.modLogs
              );
              if (modChannel) {
                let embed = new MessageEmbed()
                  .setAuthor({
                    name: `${interaction.user.username} ${
                      interaction.member.nickname
                        ? `(${interaction.member.nickname})`
                        : ""
                    }`,
                    iconURL: `${interaction.user.avatarURL()}`,
                  })
                  .setTitle("User banned")
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
              `${member} has been banned! Reason: **${reason}**`,
              {
                interaction,
              }
            );
          });
        })
        .catch(() => null);
    } catch {
      await member.ban({ reason: `${reason}` }).then(async () => {
        if (data.modLogs) {
          let modChannel = await interaction.guild.channels.fetch(data.modLogs);
          if (modChannel) {
            let embed = new MessageEmbed()
              .setAuthor({
                name: `${interaction.user.username} ${
                  interaction.member.nickname
                    ? `(${interaction.member.nickname})`
                    : ""
                }`,
                iconURL: `${interaction.user.avatarURL()}`,
              })
              .setTitle("User banned")
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
        return client.send(`${member} has been banned! Reason: **${reason}**`, {
          interaction,
        });
      });
    }
  });
