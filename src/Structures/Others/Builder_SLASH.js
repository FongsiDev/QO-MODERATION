const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
class Slash extends SlashCommandBuilder {
  constructor(data) {
    super();
    this.ownerOnly = data?.ownerOnly ?? false;
    this.supportOnly = data?.supportOnly ?? false;
    this.botPermissions = data?.botPermissions
      ? data.botPermissions.filter((x) => Permissions.FLAGS[x])
      : [];
    this.authorPermissions = data?.authorPermissions
      ? data.authorPermissions.filter((x) => Permissions.FLAGS[x])
      : [];
    this.options = data?.options
      ? this.data.options.map((option) => option.toJSON())
      : [];
    this.run = data?.run ?? (() => {});
  }
  toJSON() {
    return {
      name: this.name,
      description: this.description,
      ownerOnly: this.ownerOnly,
      supportOnly: this.supportOnly,
      botPermissions: this.botPermissions,
      authorPermissions: this.authorPermissions,
      options: this.options.map((option) => option.toJSON()),
      default_permission: this.defaultPermission,
      run: this.run,
    };
  }
  setOwner(val = true) {
    this.ownerOnly = val;
    return this;
  }
  setSupporter(val = true) {
    this.supportOnly = val;
    return this;
  }
  setBotPerms(perms) {
    if (!Array.isArray(perms))
      throw new TypeError(
        'Permissions must be an Array of Strings (e.g. ["BAN_MEMBERS", "KICK_MEMBERS"])'
      );
    this.botPermissions = perms.filter((x) => Permissions.FLAGS[x]);
    return this;
  }
  setUserPerms(perms) {
    if (!Array.isArray(perms))
      throw new TypeError(
        'Permissions must be an Array of Strings (e.g. ["BAN_MEMBERS", "KICK_MEMBERS"])'
      );
    this.authorPermissions = perms.filter((x) => Permissions.FLAGS[x]);
    return this;
  }
  setRun(func) {
    if (typeof func != "function")
      throw new TypeError(
        "Run value must be a function (e.g. (client, message, args) => {})"
      );
    this.run = func;
    return this;
  }
}
module.exports = Slash;
