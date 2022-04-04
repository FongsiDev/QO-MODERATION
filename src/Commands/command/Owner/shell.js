const process = require("child_process");
module.exports = new global.builder()
  .setName("shell")
  .setDescription("Use Shell/CMD/Terminal Command Via Discord.")
  .setAliases(["terminal", "cmd"])
  .setCategory("Owner")
  .setOwner(true)
  .setArgs(true)
  .setRun(async (client, message, args) => {
    const msg = await message.channel.send({
      embeds: [
        {
          title: "Running Shell Command.",
          description: "Please wait, 5 Second.",
          color: "YELLOW",
        },
      ],
    });
    process.exec(args.join(" "), (error, stdout) => {
      let result = clean(stdout || error);
      msg
        .edit({
          embeds: [
            {
              title: "Results Shell Command.",
              description: `\`\`\`py\n${
                result ? result.substr(0, 3048) : "\u200b"
              }\n\`\`\``,
              color: "GREEN",
            },
          ],
        })
        .catch((err) =>
          msg.edit({
            embeds: [
              {
                title: "Error was Found.",
                color: "RED",
                description: `${err}`,
              },
            ],
          })
        );
    });
  });
function clean(text) {
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 0 });
  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));
  return text;
}
