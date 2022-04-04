const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const registrar = (client) => {
  const rest = new REST({ version: "9" }).setToken(client.token);
  const commandJsonData = [
    ...Array.from(client.slashCommands.values()).map((c) => c.toJSON()),
  ];
  (async () => {
    try {
    	client.guilds.cache.map(x => {
    		x.commands.set(commandJsonData).catch(() => {});
    	});
    //	client.guilds.cache.get(global.server.id).commands.set(commandJsonData);
      /*await rest.put(Routes.applicationCommands(client.user.id), {
        body: commandJsonData,
      });*/
    } catch (error) {
      console.error(error);
    }
  })();
  return void 0;
};
module.exports = registrar;
