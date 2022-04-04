global.token = process.env.token;
global.prefix = "++";
global.owners = ["678106287820505089"];
global.maintenance = false;
global.server = {
  url: "https://discord.gg/FBfymDfrpT",
  id: "954524358636871720",
};
global.image =
  "https://media.discordapp.net/attachments/806082492498706442/900573349577633802/standard_1.gif";
global.invite =
  "https://discord.com/oauth2/authorize?client_id=945685227945222184&permissions=8&scope=bot";

global.giveaway = async (client) => {
  return {
    giveaway: `** **`,
    giveawayEnded: `** **`,
    winMessage:
      "Congratulations, {winners}! You won **{this.prize}**!\n{this.messageURL}",
  };
};
global.gdefault = {
  default: {
    botsCanWin: false,
    reaction: "<a:Giveaway:959489004577898527>",
  },
};
//global.mongourl = "mongodb+srv://Boty:96788312man@cluster0.mtscu.mongodb.net/qo?retryWrites=true&w=majority";
