module.exports = new global.SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kicks a user from the server")
  .setUserPerms(["KICK_MEMBERS"])
  .setBotPerms(["KICK_MEMBERS"])
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to kick").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for the kick")
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
    if (!member.kickable) {
      return client.send("I can't kick that user!", {
        ephemeral: true,
        interaction,
      });
    }
    try {
      const sembed2 = new MessageEmbed()
        .setColor("RED")
        .setDescription(
          `**You Have Been Kicked From ${interaction.guild.name} for ${reason} kicked by ${interaction.user.username}**`
        )
        .setFooter(interaction.guild.name, interaction.guild.iconURL());
      member
        .send({ embeds: [sembed2] })
        .then(async () => {
          await member.kick({ reason: `${reason}` }).then(async () => {
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
                  .setTitle("User kicked")
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
              `${member} has been kicked! Reason: **${reason}**`,
              {
                interaction,
              }
            );
          });
        })
        .catch(() => null);
    } catch {
      await member.kick({ reason: `${reason}` }).then(async () => {
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
              .setTitle("User kicked")
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
        return client.send(`${member} has been kicked! Reason: **${reason}**`, {
          interaction,
        });
      });
    }
  });
