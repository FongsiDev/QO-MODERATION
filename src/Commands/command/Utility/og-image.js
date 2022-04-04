module.exports = new global.builder()
  .setName("og-image")
  .setDescription(
    "A service to generate dynamic Open Graph images on-the-fly for the purpose of sharing a website to social media. Proudly hosted on Vercel."
  )
  .setArgs(true)
  .setUsage("og-image <image> <image_2>")
  .setCategory("Utility")
  .setRun(async (client, message, args) => {
    if (is_url(args[1]) === false)
      return client.send("Invalid URL Image, pls add url image!", { message });
    if (is_url(args[2]) === false)
      return client.send("Invalid URL Image, pls add url image again!", {
        message,
      });
    const image = `https://og-image.vercel.app/${args[0]}.png?theme=light&md=1&fontSize=100px&images=${args[1]}&images=${args[2]}`;
    client.send("Here", { message, image });
  });
function is_url(str) {
  let regexp =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
}
