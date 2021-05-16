const stripIndent = require("common-tags").stripIndent;
require("colors");

const axios = require("axios");
const Commando = require("discord.js-commando");

module.exports = class UrbanCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "urban",
      group: "api-based",
      memberName: "urban",
      description: `
        Search for words in Urban Disctionary.
        NOTE: These are community written meanings and may not 
              represent the actual meaning of the word.
      `,
      examples: ["urban Bruh", "urban LoL"],
      args: [
        {
          key: "queryWord",
          prompt: "What word do you want to search for?",
          type: "string",
        },
      ],
      throttling: {
        usages: 1,
        duration: 3,
      },
    });
  }

  async run(message, args) {
    const { queryWord } = args;

    const RAPID_API_KEY = process.env.RAPID_API_KEY;

    try {
      const API_HOST = "mashape-community-urban-dictionary.p.rapidapi.com";
      const API_ENDPOINT =
        "https://mashape-community-urban-dictionary.p.rapidapi.com/define";

      const response = await axios.request({
        method: "GET",
        url: API_ENDPOINT,
        params: { term: queryWord },
        headers: {
          "x-rapidapi-key": RAPID_API_KEY,
          "x-rapidapi-host": API_HOST,
        },
      });

      const resultWord = response.data.list[0];

      if (!response) {
        message.reply(
          `Didn't find the definition of "${args}". Please try again.`
        );
      }

      const word = resultWord.word;
      const definition = resultWord.definition;
      const link = resultWord.permalink;
      const thumbsUp = resultWord.thumbs_up;
      const thumbsDown = resultWord.thumbs_down;
      const example = resultWord.example ? resultWord.example : "None";
      const writtenOn = resultWord.written_on;

      const urbanDictionaryLogo =
        "https://i.ibb.co/9VrZLmP/Urban-Dictionary.png";

      const embed = {
        title: word,
        description: definition,
        url: link,
        thumbnail: {
          url: urbanDictionaryLogo,
        },
        color: "#59829C",
        fields: [
          {
            name: `VOTES`,
            value: stripIndent`
              👍 ${thumbsUp}  | 👎 ${thumbsDown}

              **EXAMPLE**
              ${example}
            `,
          },
        ],
        timestamp: writtenOn,
      };

      message.embed(embed);
    } catch (error) {
      console.error(error);
    }
  }
};
