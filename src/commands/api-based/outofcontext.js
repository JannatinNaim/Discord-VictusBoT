require("colors");

const axios = require("axios").default;
const Commando = require("discord.js-commando");

module.exports = class OutOfContextCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "outofcontext",
      aliases: ["ofc"],
      memberName: "outofcontext",
      group: "api-based",
      description: `
        Get out of context results from Wiki How.
        NOTE: Things might get weird, so use at your own caution.
      `,
      throttling: {
        usages: 1,
        duration: 3,
      },
    });
  }

  async run(message) {
    const RAPID_API_KEY = process.env.RAPID_API_KEY;

    try {
      const API_HOST = "hargrimm-wikihow-v1.p.rapidapi.com";
      const API_ENDPOINT = "https://hargrimm-wikihow-v1.p.rapidapi.com/steps";

      const response = await axios.request({
        method: "GET",
        url: API_ENDPOINT,
        params: { count: "1" },
        headers: {
          "x-rapidapi-key": RAPID_API_KEY,
          "x-rapidapi-host": API_HOST,
        },
      });

      const outOfConTEXT = response.data;

      await message.say(outOfConTEXT["1"]);
    } catch (err) {
      console.error(`${err}`.red);
    }
  }
};
