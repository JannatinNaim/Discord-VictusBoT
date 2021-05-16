require("colors");

const axios = require("axios").default;
const Commando = require("discord.js-commando");

module.exports = class NewsCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "news",
      memberName: "news",
      group: "api-based",
      description: `
        Search for top news articles on a specific topic.
        NOTE: Be concise, this can't filter out typos and will only present
              the most relevant article (if there is any).
      `,
      args: [
        {
          key: "query",
          prompt: "What topic do you want to search for?",
          type: "string",
        },
      ],
      examples: ["news <country>", "news covid"],
      throttling: {
        usages: 1,
        duration: 3,
      },
    });
  }

  async run(message, args) {
    const { query } = args;
    const RAPID_API_KEY = process.env.RAPID_API_KEY;

    try {
      const API_ENDPOINT = "https://free-news.p.rapidapi.com/v1/search";
      const API_HOST = "free-news.p.rapidapi.com";

      const response = await axios.request({
        method: "GET",
        url: API_ENDPOINT,
        params: { q: query, lang: "en" },
        headers: {
          "x-rapidapi-key": RAPID_API_KEY,
          "x-rapidapi-host": API_HOST,
        },
      });

      const randomIndex = Math.floor(
        Math.random() * response.data.articles.length
      );

      const article = response.data.articles[randomIndex];

      const title = article.title;
      const author = article.author ? article.author : "N / A";
      const publishedDate = article.published_date;
      const link = article.link;
      const image = article.media;
      const summary = article.summary ? article.summary : "N / A";

      const embed = {
        title: title,
        url: link,
        author: {
          name: author,
        },
        image: {
          url: image,
        },
        fields: [
          {
            name: `Summary`,
            value: summary,
          },
        ],
        timestamp: publishedDate,
      };

      await message.embed(embed);
    } catch (err) {
      console.error(`${err}.red`);
    }
  }
};
