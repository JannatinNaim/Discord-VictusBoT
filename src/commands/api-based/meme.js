const axios = require("axios").default;

require("colors");

const Commando = require("discord.js-commando");

module.exports = class MemeCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "meme",
      memberName: "meme",
      group: "api-based",
      description: `
        Get random memes.
        NOTE: Memes come from the r/memes subreddit..
      `,
      throttling: {
        usages: 1,
        duration: 3,
      },
    });
  }

  async run(message) {
    const MEME_API_ENDPOINT = "https://meme-api.herokuapp.com/gimme/memes";

    try {
      const response = await axios.request({
        method: "GET",
        url: MEME_API_ENDPOINT,
      });

      const meme = response.data;

      const title = meme.title;
      const url = meme.url;
      const author = meme.author;
      const postLink = meme.postLink;

      const embed = {
        title: title,
        author: author,
        url: postLink,
        image: {
          url: url,
        },
      };

      await message.embed(embed);
    } catch (err) {
      console.error(`${err}`.red);
    }
  }
};
