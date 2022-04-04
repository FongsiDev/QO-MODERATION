class Card {
  constructor(data) {
    this.discrimcolor = data?.discrimcolor ?? "";
    this.countcolor = data?.countcolor ?? "";
    this.background = data?.background ?? "";
    this.headcolor = data?.headcolor ?? "";
    this.username = data?.username ?? "";
    this.discriminator = data?.discriminator ?? "";
    this.avatar = data?.avatar ?? "";
    this.header = data?.header ?? "";
    this.count = data?.count ?? "";
  }
  img() {
    const params = new URLSearchParams({
      avatar: this.avatar,
      memcount: this.count,
      discrim: this.discriminator, //tag of user #6969
      username: this.username,
      bg: this.background,
      header: this.header,
      headcolor: this.headcolor,
      discrimcolor: this.discrimcolor,
      countcolor: this.countcolor,
    });

    const image = "https://badboy.is-a.dev/api/image/welcomecard?" + params;
    return image;
  }
  setAvatar(url) {
    this.avatar = url;
    return this;
  }
  setUsername(name) {
    this.username = name;
    return this;
  }
  setDiscriminator(is) {
    this.discriminator = is;
    return this;
  }
  setBackground(url) {
    this.background = url;
    return this;
  }
  setHeader(is) {
    this.header = is;
    return this;
  }
  setCount(count) {
    if (isNaN(count))
      throw new TypeError("Count value must be a Number in seconds");
    this.count = count;
    return this;
  }
  setCountColor(color) {
    this.countcolor = color;
    return this;
  }
  setHeadColor(color) {
    this.headcolor = color;
    return this;
  }
  setDiscrimColor(color) {
    this.discrimcolor = color;
    return this;
  }
}
module.exports = Card;
