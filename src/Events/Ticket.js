const { createTranscript } = require("discord-html-transcripts");
module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      let data = await client.db.get(`ticket_${interaction.guild.id}`);
      const { StaffRoleId, CatergoryID, TrasnscriptID } = {
        StaffRoleId: data.role,
        CatergoryID: data.channel,
        TrasnscriptID: "954588382657400832",
      };

      if (interaction.customId === "ticket-open") {
        await interaction.deferReply({ ephemeral: true });
        if (
          interaction.guild.channels.cache.find(
            (e) => e.topic == interaction.user.id
          )
        ) {
          return interaction.followUp({
            content: "*Bakaa~* You already have a ticket open! 🗿",
            ephemeral: true,
          });
        }
        const channelMade = interaction.guild.channels
          .create(`${interaction.user.tag} Ticket`, {
            parent: CatergoryID,
            topic: interaction.user.id,
            permissionOverwrites: [
              {
                id: interaction.user.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
              {
                id: client.user.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
              {
                id: StaffRoleId,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
              {
                id: interaction.guild.roles.everyone,
                deny: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
            ],
            type: "GUILD_TEXT",
          })
          .then(async (c) => {
            interaction.followUp({
              embeds: [
                new global.MessageEmbed()
                  .setColor("BLUE")
                  .setDescription(
                    `<@${interaction.user.id}> You have made a ticket.`
                  )
                  .setThumbnail(
                    `${interaction.user.displayAvatarURL({
                      dynamic: true,
                      size: 512,
                    })}`
                  )
                  .setAuthor({
                    name: "Your ticket has been made!",
                    iconURL: `${client.user.displayAvatarURL()}`,
                  }),
              ],
              ephemeral: true,
            });
            const newtic = new global.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: `${interaction.guild.name} support!`,
                iconURL: `${
                  interaction.guild.iconURL() ||
                  "https://cdn.discordapp.com/embed/avatars/0.png"
                }`,
              })
              .setFooter({
                text: "Your ticket will be recorded in a transcript",
                iconURL: `${interaction.user.displayAvatarURL()}`,
              })
              .setDescription(
                "Hello there, \n The staff will be here as soon as possible mean while tell us about your issue!\nThank You!"
              )
              .addField(
                "To Create A Transcript:",
                "By pressing on the green button labbeld `Claiming` the channels transcript will be sent here.\n When this ticket is closed too, a copy of this tickets Transcript will be kept also."
              );

            let button1 = new global.MessageButton()
              .setCustomId("ticket-close")
              .setLabel("Close Ticket")
              .setEmoji("🔒")
              .setStyle("DANGER");

            let button2 = new global.MessageButton()
              .setCustomId("Transcript")
              .setLabel("Claim")
              .setStyle("SUCCESS");

            let button3 = new global.MessageButton()
              .setCustomId("zing")
              .setDisabled(true)
              .setEmoji("🕰️")
              .setStyle("SECONDARY");

            let button4 = new global.MessageButton()
              .setCustomId("Lock")
              .setLabel("Archieve Ticket")
              .setStyle("DANGER");

            let button5 = new global.MessageButton()
              .setCustomId("Unlock")
              .setLabel("Un-Archieve Ticket")
              .setStyle("PRIMARY");

            const row = new global.MessageActionRow().addComponents(
              button1,
              button2,
              button3,
              button4,
              button5
            );

            c.send({
              content: `<@&${StaffRoleId}> | <@${interaction.user.id}>`,
              embeds: [newtic],
              components: [row],
            }).then((msg) => msg.pin());
          });
      } else if (interaction.customId === "ticket-close") {
        const StaffPeople = interaction.guild.roles.cache
          .get(StaffRoleId)
          .members.map((x) => x.user.id);
        if (
          StaffPeople.concat(interaction.guild.ownerId).includes(
            interaction.user.id
          ) === false
        ) {
          interaction.reply({
            content: "You do not have permissiont to close the ticket!",
            ephemeral: true,
          });
        } else {
          interaction.reply({
            embeds: [
              new global.MessageEmbed()
                .setColor("BLUE")
                .setTitle(
                  `Ticket will be closed. ${await client.emoji("Loading")}`
                )
                .setDescription("Closing the ticket in 3 seconds...")
                .setAuthor({
                  name: `${interaction.guild.name} support!`,
                  iconURL: `${
                    interaction.guild.iconURL() ||
                    "https://cdn.discordapp.com/embed/avatars/0.png"
                  }`,
                }),
            ],
          });
          if (
            (interaction.channel.topic === interaction.user.id) ===
              interaction.user.id &&
            interaction.guild.ownerId &&
            StaffRoleId !== interaction.user.id
          ) {
            return interaction.followUp({
              content: `This ticket can only be closed by staff members.`,
              ephemeral: true,
            });
          }
          const Trasnscript = await createTranscript(interaction.channel, {
            limit: -1,
            fileName: `${interaction.channel.topic}-Ticket-Transcript.html`,
            returnBuffer: false,
          });
          /*
          const embedClosedTicket = new global.MessageEmbed()
            .setColor("RED")
            .setDescription(
              `<@${interaction.user.id}>'s Ticket has been closed`
            )
            .setAuthor({
              name: `${interaction.guild.name} support!`,
              iconURL: `${interaction.guild.iconURL() || "https://cdn.discordapp.com/embed/avatars/0.png"}`,
            });

          client.channels.cache
            .get(TrasnscriptID)
            .send({ embeds: [embedClosedTicket], files: [Trasnscript] });*/
          setTimeout(() => {
            interaction.channel.delete();
          }, 3000);
        }
      } else if (interaction.customId === "Transcript") {
        const Trasnscript = await createTranscript(interaction.channel, {
          limit: -1,
          fileName: `${interaction.channel.topic}-Ticket-Transcript.html`,
          returnBuffer: false,
        });

        interaction.reply({
          content: `Here is the tickets Transcript! <@${interaction.user.id}>`,
          files: [Trasnscript],
        });
      } else if (interaction.customId === "Lock") {
        const StaffPeople = interaction.guild.roles.cache
          .get(StaffRoleId)
          .members.map((x) => x.user.id);
        if (
          StaffPeople.concat(interaction.guild.ownerId).includes(
            interaction.user.id
          ) === false
        ) {
          interaction.reply({
            content: "You do not have permissiont to lock the ticket!",
            ephemeral: true,
          });
        } else {
          interaction.channel.permissionOverwrites
            .set([
              {
                id: interaction.user.id,
                deny: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
              {
                id: client.user.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
              {
                id: StaffRoleId,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
              {
                id: interaction.guild.roles.everyone,
                deny: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              }
            ])
            .then(
              interaction.reply({
                embeds: [
                  new global.MessageEmbed()
                    .setColor("YELLOW")
                    .setDescription(
                      "😂 I have archieved the ticket for further reviewing!"
                    ),
                ],
                ephemeral: true,
              })
            );
        }
      } else if (interaction.customId == "Unlock") {
        const StaffPeople = interaction.guild.roles.cache
          .get(StaffRoleId)
          .members.map((x) => x.user.id);
        if (
          StaffPeople.concat(interaction.guild.ownerId).includes(
            interaction.user.id
          ) === false
        ) {
          interaction.reply({
            content: "You do not have permissiont to unlock the ticket!",
            ephemeral: true,
          });
        } else {
          interaction.channel.permissionOverwrites
            .set([
              {
                id: interaction.user.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
              {
                id: client.user.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
              {
                id: StaffRoleId,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              },
              {
                id: interaction.guild.roles.everyone,
                deny: ["SEND_MESSAGES", "VIEW_CHANNEL"],
              }
            ])
            .then(
              interaction.reply({
                embeds: [
                  new global.MessageEmbed()
                    .setColor("YELLOW")
                    .setDescription("😜 I have un-archieved the ticket!"),
                ],
                ephemeral: true,
              })
            );
        }
      }
    }
  });
};