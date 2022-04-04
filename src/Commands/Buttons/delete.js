module.exports = {
  name: "delete_msg",
  run: async (interaction) => {
    interaction.message.delete().catch(() => {});
  },
};
