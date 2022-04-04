class DiscordXp {
  constructor(data) {
    this.data = data;
  }
  async createUser(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const isUser = await global.db.get(`Level_${guildId}_${userId}`);
    if (isUser) {
      global.db.set(`Level_${guildId}_${userId}`, { lastUpdated: new Date() });
    }
    return { userID: userId, guildID: guildId };
  }

  async deleteUser(userId, guildId) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const user = await global.db.get(`Level_${guildId}`);
    if (!user) return false;
    let data = user.find((x) => x.userID === userId);
    let index = user.indexOf(data);
    delete user[index];
    let filter = user.filter((x) => {
      return x !== null && x;
    });
    await global.db.set(`Level_${guildId}_${userId}`, filter);

    return true;
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   * @param {number} [xp] - Amount of xp to append.
   */

  async appendXp(userId, guildId, xp) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (xp == 0 || !xp || isNaN(parseInt(xp)))
      throw new TypeError("An amount of xp was not provided/was invalid.");

    const user = await global.db.get(`Level_${guildId}_${userId}`);

    if (!user) {
      const newUser = new global.db.set(`Level_${guildId}_${userId}`, {
        xp: xp,
        level: Math.floor(0.1 * Math.sqrt(xp)),
      });
      return Math.floor(0.1 * Math.sqrt(xp)) > 0;
    }

    user.xp += parseInt(xp, 10);
    user.level = Math.floor(0.1 * Math.sqrt(user.xp));
    user.lastUpdated = new Date();
    global.db.set(`Level_${guildId}_${userId}`, user);
    return Math.floor(0.1 * Math.sqrt((user.xp -= xp))) < user.level;
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   * @param {number} [levels] - Amount of levels to append.
   */

  async appendLevel(userId, guildId, levelss) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!levelss) throw new TypeError("An amount of levels was not provided.");

    const user = await global.db.get(`Level_${guildId}_${userId}`);
    if (!user) return false;

    user.level += parseInt(levelss, 10);
    user.xp = user.level * user.level * 100;
    user.lastUpdated = new Date();
    global.db.set(`Level_${guildId}_${userId}`, user);

    return user;
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   * @param {number} [xp] - Amount of xp to set.
   */

  async setXp(userId, guildId, xp) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (xp == 0 || !xp || isNaN(parseInt(xp)))
      throw new TypeError("An amount of xp was not provided/was invalid.");

    const user = await global.db.get(`Level_${guildId}_${userId}`);
    if (!user) return false;

    user.xp = xp;
    user.level = Math.floor(0.1 * Math.sqrt(user.xp));
    user.lastUpdated = new Date();

    global.db.set(`Level_${guildId}_${userId}`, user);

    return user;
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   * @param {number} [level] - A level to set.
   */

  async setLevel(userId, guildId, level) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!level) throw new TypeError("A level was not provided.");

    const user = await global.db.get(`Level_${guildId}_${userId}`);
    if (!user) return false;

    user.level = level;
    user.xp = level * level * 100;
    user.lastUpdated = new Date();

    global.db.set(`Level_${guildId}_${userId}`, user);

    return user;
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   */

  async fetch(userId, guildId, fetchPosition = false) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const user = await global.db.get(`Level_${guildId}_${userId}`);
    if (!user) return false;
    /*
    if (fetchPosition === true) {
      const leaderboard = await user.sort([['xp', 'descending']]).exec();

      user.position = leaderboard.findIndex(i => i.userID === userId) + 1;
    }
*/

    /* To be used with canvacord or displaying xp in a pretier fashion, with each level the cleanXp stats from 0 and goes until cleanNextLevelXp when user levels up and gets back to 0 then the cleanNextLevelXp is re-calculated */
    user.cleanXp = user.xp - this.xpFor(user.level);
    user.cleanNextLevelXp = this.xpFor(user.level + 1) - this.xpFor(user.level);

    return user;
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   * @param {number} [xp] - Amount of xp to subtract.
   */

  async subtractXp(userId, guildId, xp) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (xp == 0 || !xp || isNaN(parseInt(xp)))
      throw new TypeError("An amount of xp was not provided/was invalid.");

    const user = await global.db.get(`Level_${guildId}_${userId}`);
    if (!user) return false;

    user.xp -= xp;
    user.level = Math.floor(0.1 * Math.sqrt(user.xp));
    user.lastUpdated = new Date();

    global.db.set(`Level_${guildId}_${userId}`, user);

    return user;
  }

  /**
   * @param {string} [userId] - Discord user id.
   * @param {string} [guildId] - Discord guild id.
   * @param {number} [levels] - Amount of levels to subtract.
   */

  async subtractLevel(userId, guildId, levelss) {
    if (!userId) throw new TypeError("An user id was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!levelss) throw new TypeError("An amount of levels was not provided.");

    const user = await global.db.get(`Level_${guildId}_${userId}`);
    if (!user) return false;

    user.level -= levelss;
    user.xp = user.level * user.level * 100;
    user.lastUpdated = new Date();

    global.db.set(`Level_${guildId}_${userId}`, user);

    return user;
  }

  /**
   * @param {string} [guildId] - Discord guild id.
   * @param {number} [limit] - Amount of maximum enteries to return.
   */
  //Soon
  /*
  async fetchLeaderboard(guildId, limit) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!limit) throw new TypeError("A limit was not provided.");

    var users = await levels.find({ guildID: guildId }).sort([['xp', 'descending']]).exec();

    return users.slice(0, limit);
  }
*/
  /**
   * @param {string} [client] - Your Discord.CLient.
   * @param {array} [leaderboard] - The output from 'fetchLeaderboard' function.
   */

  async computeLeaderboard(client, leaderboard, fetchUsers = false) {
    if (!client) throw new TypeError("A client was not provided.");
    if (!leaderboard) throw new TypeError("A leaderboard id was not provided.");

    if (leaderboard.length < 1) return [];

    const computedArray = [];

    if (fetchUsers) {
      for (const key of leaderboard) {
        const user = (await client.users.fetch(key.userID)) || {
          username: "Unknown",
          discriminator: "0000",
        };
        computedArray.push({
          guildID: key.guildID,
          userID: key.userID,
          xp: key.xp,
          level: key.level,
          position:
            leaderboard.findIndex(
              (i) => i.guildID === key.guildID && i.userID === key.userID
            ) + 1,
          username: user.username,
          discriminator: user.discriminator,
        });
      }
    } else {
      leaderboard.map((key) =>
        computedArray.push({
          guildID: key.guildID,
          userID: key.userID,
          xp: key.xp,
          level: key.level,
          position:
            leaderboard.findIndex(
              (i) => i.guildID === key.guildID && i.userID === key.userID
            ) + 1,
          username: client.users.cache.get(key.userID)
            ? client.users.cache.get(key.userID).username
            : "Unknown",
          discriminator: client.users.cache.get(key.userID)
            ? client.users.cache.get(key.userID).discriminator
            : "0000",
        })
      );
    }

    return computedArray;
  }

  /*
   * @param {number} [targetLevel] - Xp required to reach that level.
   */
  xpFor(targetLevel) {
    if (isNaN(targetLevel) || isNaN(parseInt(targetLevel, 10)))
      throw new TypeError("Target level should be a valid number.");
    if (isNaN(targetLevel)) targetLevel = parseInt(targetLevel, 10);
    if (targetLevel < 0)
      throw new RangeError("Target level should be a positive number.");
    return targetLevel * targetLevel * 100;
  }

  /**
   * @param {string} [guildId] - Discord guild id.
   */

  async deleteGuild(guildId) {
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const guild = await levels.findOne({ guildID: guildId });
    if (!guild) return false;

    await levels
      .deleteMany({ guildID: guildId })
      .catch((e) => console.log(`Failed to delete guild: ${e}`));

    return guild;
  }
}

module.exports = DiscordXp;
