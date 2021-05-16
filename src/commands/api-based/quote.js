require("colors");

const axios = require("axios");
const Commando = require("discord.js-commando");

module.exports = class QuoteCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "quote",
      memberName: "quote",
      group: "api-based",
      description: `
        Get a random quote each time.
        NOTE: Quotes might be random and not relevant at all.
      `,
      examples: ["quote"],
      throttling: {
        usages: 1,
        duration: 3,
      },
    });
  }

  async run(message) {
    const RAPID_API_KEY = process.env.RAPID_API_KEY;

    try {
      const API_HOST = "quotes15.p.rapidapi.com";
      const API_ENDPOINT = "https://quotes15.p.rapidapi.com/quotes/random/";

      const response = await axios.request({
        method: "GET",
        url: API_ENDPOINT,
        params: { language_code: "en" },
        headers: {
          "x-rapidapi-key": RAPID_API_KEY,
          "x-rapidapi-host": API_HOST,
        },
      });

      const quoteData = response.data;

      const quote = quoteData.content;
      const author = quoteData.originator.name;

      const embed = {
        title: author,
        description: quote,
        color: "#fcba03",
      };

      await message.embed(embed);
    } catch (err) {
      console.error(`${err}`.red);
    }
  }
};
