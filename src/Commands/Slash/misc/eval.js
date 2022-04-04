const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const util = require("util");
module.exports = new global.SlashCommandBuilder()
  .setName("eval")
  .setDescription("Evaluate a javascript expression.")
  .setOwner(true)
  .addStringOption((option) =>
    option
      .setName("expression")
      .setDescription("The code to evaluate!")
      .setRequired(true)
  )
  .setRun(async (interaction, client) => {
    const string = interaction.options.getString("expression");
    const evalEmbed = new global.MessageEmbed().setColor("RANDOM");
    try {
      var evaled = clean(await eval(string));
      if (evaled.startsWith(client.token)) evaled = `Error: Unexpected token`;
      if (evaled.constructor.name === "Promise")
        evalEmbed.setDescription(`\`\`\`\n${evaled}\n\`\`\``);
      else evalEmbed.setDescription(`\`\`\`js\n${evaled}\n\`\`\``);
      const newEmbed = new global.MessageEmbed()
        .setDescription(
          `📤 Login\n\`\`\`javascript\n${string}\n\`\`\`\n📥 Exit\n\`\`\`js\n${
            evaled ? evaled.substr(0, 3048) : "\u200b"
          }\`\`\``
        )
        .setColor("BLUE");
      client.send(null, { embed: [newEmbed], ephemeral: true, interaction });
    } catch (err) {
      evalEmbed.addField("There was an error;", `\`\`\`js\n${err}\n\`\`\``);
      evalEmbed.setColor("#FF0000");
      client.send(null, { embed: [evalEmbed], ephemeral: true, interaction });
    }
  });
function clean(text) {
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 0 });
  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));
  return text;
}
function reslash(client) {
  const rest = new REST({ version: "9" }).setToken(client.token);
  rest.get(Routes.applicationCommands(client.user.id)).then((data) => {
    const promises = [];
    for (const command of data) {
      const deleteUrl = `${Routes.applicationCommands(client.user.id)}/${
        command.id
      }`;
      promises.push(rest.delete(deleteUrl));
    }
    return Promise.all(promises);
  });
}
