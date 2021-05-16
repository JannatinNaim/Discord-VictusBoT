const stripIndent = require("common-tags").stripIndent;
require("colors");

const axios = require("axios").default;
const Commando = require("discord.js-commando");

module.exports = class AnimeCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "anime",
      memberName: "anime",
      group: "api-based",
      description: `
        Search for Anime on MyAnimeList.
        The top-most relevant search will be shown.
        NOTE: Short abbrebeation of names might not work.
              Please use the full name to search.  
      `,
      examples: [
        "anime Naruto",
        "anime Death Note",
        "anime The Rize of the Shield Hero",
      ],
      throttling: {
        duration: 3,
        usages: 1,
      },
      args: [
        {
          key: "queryAnime",
          prompt: "What anime do you want to search for?",
          type: "string",
        },
      ],
    });
  }

  async run(message, args) {
    const RAPID_API_KEY = process.env.RAPID_API_KEY;

    try {
      const RAPID_API_HOST = "jikan1.p.rapidapi.com";
      const API_ENDPOINT = "https://jikan1.p.rapidapi.com/search/anime";

      const response = await axios.request({
        method: "GET",
        url: API_ENDPOINT,
        params: { q: args, limit: 5 },
        headers: {
          "x-rapidapi-key": RAPID_API_KEY,
          "x-rapidapi-host": RAPID_API_HOST,
        },
      });

      const anime = response.data.results[0];

      const title = anime.title;
      const synopsis = anime.synopsis;
      const type = anime.type;
      const episodes = anime.episodes;
      const startDate = anime.start_date.substring(0, 10);
      const endDate = anime.end_date.substring(0, 10);
      const score = anime.score;
      const rated = anime.rated;
      const url = anime.url;
      const coverUrl = anime.image_url;
      const airing = anime.airing;

      const embed = {
        title: title,
        url: url,
        image: {
          url: coverUrl,
        },
        color: "#4275cc",
        fields: [
          {
            name: title,
            value: stripIndent`
              ${synopsis}
              
              📂 **EPISODES** - ${episodes}
              🧬 **TYPE** - ${type}
              ⏱ **START** - ${startDate}
              ⏲ **END** - ${endDate}
              📊 **SCORE** - ${score}
              👪 **RATED** - ${rated}
              📡 **AIRING** - ${airing}
            `,
          },
        ],
      };

      message.embed(embed);
    } catch (err) {
      console.error(`${err}`.red);
    }
  }
};
