require("dotenv").config(".env");
const { Command } = require("discord.js-commando");
const axios = require("axios");

module.exports = class YouTubeSearchCommand extends Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "youtube",
      aliases: ["yt", "youtube"],
      group: "api-based",
      memberName: "youtube",
      description: `
        Search for videos on YouTube.
        NOTE: Only the most relevant search results are shown.
      `,
      examples: ["yt something just like this", "yt how you like that"],
      args: [
        {
          key: "queryVideo",
          prompt: "Which video do you want to search for?",
          type: "string",
        },
      ],
    });
  }

  async run(message, args) {
    const { queryVideo } = args;

    const RAPID_API_KEY = process.env.RAPID_API_KEY;

    try {
      const API_HOST = "youtube-v31.p.rapidapi.com";
      const API_ENDPOINT = "https://youtube-v31.p.rapidapi.com/search";

      const response = await axios.request({
        method: "GET",
        url: API_ENDPOINT,
        params: {
          q: queryVideo,
          maxResults: "1",
          part: "id,snippet",
          regionCode: "US",
          type: "video",
        },
        headers: {
          "x-rapidapi-key": RAPID_API_KEY,
          "x-rapidapi-host": API_HOST,
        },
      });

      const videoURL = `https://www.youtube.com/watch?v=${response.data.items[0].id.videoId}`;

      await message.say(videoURL);
    } catch (err) {
      await message.reply(
        `Couldn't find a video with "${queryVideo}". Please try again.`
      );
    }
  }
};
