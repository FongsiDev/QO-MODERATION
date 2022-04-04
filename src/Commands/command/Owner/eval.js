const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { MessageEmbed: embed } = require("discord.js");
module.exports = new global.builder()
  .setName("eval")
  .setDescription("Eval Command")
  .setCategory("Owner")
  .setOwner(true)
  .setArgs(true)
  .setRun(async (client, message, args) => {
    const evalEmbed = new embed().setColor("RANDOM");
    try {
      var evaled = clean(await eval(args.join(" ")));
      if (evaled.startsWith(client.token)) evaled = `Error: Unexpected token`;
      if (evaled.constructor.name === "Promise")
        evalEmbed.setDescription(`\`\`\`\n${evaled}\n\`\`\``);
      else evalEmbed.setDescription(`\`\`\`js\n${evaled}\n\`\`\``);
      const newEmbed = new embed()
        .setDescription(
          `📤 Login\n\`\`\`javascript\n${args.join(
            " "
          )}\n\`\`\`\n📥 Exit\n\`\`\`js\n${
            evaled ? evaled.substr(0, 3048) : "\u200b"
          }\`\`\``
        )
        .setColor("BLUE");
      message.channel.send({ embeds: [newEmbed] });
    } catch (err) {
      evalEmbed.addField("There was an error;", `\`\`\`js\n${err}\n\`\`\``);
      evalEmbed.setColor("#FF0000");
      message.channel.send({ embeds: [evalEmbed] });
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
  rest
    .get(Routes.applicationGuildCommands(client.user.id, global.server.id))
    .then((data) => {
      const promises = [];
      for (const command of data) {
        const deleteUrl = `${Routes.applicationCommands(
          client.user.id,
          global.server.id
        )}/${command.id}`;
        promises.push(rest.delete(deleteUrl));
      }
      return Promise.all(promises);
    });
}
function reslash_(client) {
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
