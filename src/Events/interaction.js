module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    try {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) {
        interaction.reply({
          content:
            "There was an error while executing this command, please try again and If this continues to happen talk to the bot owner.",
          ephemeral: true,
        });
      }
      if (
        interaction.commandName &&
        global.maintenance &&
        global.owners.includes(interaction.user.id) === false
      ) {
        return client.send("*Command is in progress, you can't use cmd Now*", {
          interaction,
          ephemeral: true,
        });
      }
      if (command.ownerOnly) {
        if (global.owners.includes(interaction.user.id) === false) {
          return client.send(`Only Bot Developer can use this command!*`, {
            interaction,
            ephemeral: true,
          });
        }
      }
      if (command.supportOnly) {
        if (global.owners.includes(interaction.user.id) === false) {
          return client.send(
            `You don't support our server, please join our server so you can access this command`,
            { interaction, ephemeral: true }
          );
        }
      }
      if (command.botPermissions) {
        const Permissions = command.botPermissions
          .filter((x) => !interaction.guild.me.permissions.has(x))
          .map((x) => "`" + x + "`");
        if (Permissions.length)
          return client.send(
            `I need ${Permissions.join(
              ", "
            )} permission(s) to execute the command!`,
            { interaction }
          );
      }

      if (command.authorPermissions) {
        const Permissions = command.authorPermissions
          .filter((x) => !interaction.member.permissions.has(x))
          .map((x) => "`" + x + "`");
        if (Permissions.length)
          return client.send(
            `You need ${Permissions.join(
              ", "
            )} permission(s) to execute this command!`,
            { interaction }
          );
      }

      await command.run(interaction, client, { modlog: null }).catch((e) => {
        interaction.reply({
          content:
            "There was an error while executing this command, please try again and If this continues to happen talk to the bot owner.",
          ephemeral: true,
        });
        console.error(e);
      });
    } catch (error) {
      interaction.reply({
        content:
          "There was an error while executing this command, please try again and If this continues to happen talk to the bot owner.",
        ephemeral: true,
      });
      console.log(error);
    }
  });
};
