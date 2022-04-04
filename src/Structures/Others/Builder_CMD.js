const { Permissions } = require("discord.js");
class Command {
  constructor(data) {
    this.name = data?.name ?? null;
    this.description = data?.description ?? null;
    this.category = data?.category ?? null;
    this.usage = data?.usage ?? null;
    this.ownerOnly = data?.ownerOnly ?? false;
    this.supportOnly = data?.supportOnly ?? false;
    this.aliases = data?.aliases ?? [];
    this.args = data?.args ?? false;
    this.botPermissions = data?.botPermissions
      ? data.botPermissions.filter((x) => Permissions.FLAGS[x])
      : [];
    this.authorPermissions = data?.authorPermissions
      ? data.authorPermissions.filter((x) => Permissions.FLAGS[x])
      : [];
    this.cooldown = data?.cooldown ?? 0;
    this.run = data?.run ?? (() => {});
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      category: this.category,
      ownerOnly: this.ownerOnly,
      supportOnly: this.supportOnly,
      aliases: this.aliases,
      args: this.args,
      botPermissions: this.botPermissions,
      authorPermissions: this.authorPermissions,
      cooldown: this.cooldown,
      run: this.run,
    };
  }
  setName(name) {
    this.name = name;
    return this;
  }
  setDescription(desc) {
    this.description = desc;
    return this;
  }
  setUsage(use) {
    this.usage = use;
    return this;
  }
  setCategory(ctg) {
    this.category = ctg;
    return this;
  }
  setOwner(val = false) {
    this.ownerOnly = val;
    return this;
  }
  setSupporter(val = false) {
    this.supportOnly = val;
    return this;
  }
  setArgs(val = false) {
    this.args = val;
    return this;
  }
  setAliases(a) {
    if (Array.isArray(a)) {
      a.forEach((alias) => {
        if (typeof alias != "string")
          throw new TypeError("Aliases must be a string!");
      });
      this.aliases = a;
    } else {
      if (typeof a != "string")
        throw new TypeError("Aliases must be a string!");
      this.aliases = [a];
    }
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
  setCooldown(sec) {
    if (isNaN(sec))
      throw new TypeError("Cooldown value must be a Number in seconds");
    this.cooldown = sec;
    return this;
  }
}

module.exports = Command;
