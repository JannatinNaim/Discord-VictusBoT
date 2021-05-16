require("colors");

const axios = require("axios").default;
const Commando = require("discord.js-commando");

module.exports = class HackerNewsCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "hacker",
      memberName: "hackernews",
      group: "api-based",
      description: `
        Get articles from Hacker News' Top, New and Best catagories.
        NOTE: If no catagory is specified, it will default to top.
      `,
      examples: ["hacker top", "hacker new", "hacker best", "hacker"],
      args: [
        {
          key: "catagory",
          prompt: "What catagory do you want to search for?",
          type: "string",
          default: "top",
        },
      ],
      throttling: {
        usages: 1,
        duration: 3,
      },
    });
  }

  async run(message, args) {
    const { catagory } = args;

    if (catagory === "new") {
      try {
        const newStories = await axios.get(
          "https://hacker-news.firebaseio.com/v0/newstories.json"
        );

        const randomIndex = Math.floor(Math.random() * newStories.data.length);

        const randomNewStory = newStories.data[randomIndex];

        try {
          const response = await axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${randomNewStory}.json`
          );

          const newStoryLink = response.data.url;

          await message.say(newStoryLink);
        } catch (err) {
          console.error(`${err}`.red);
        }
      } catch (err) {
        console.error(`${err}`.red);
      }
    } else if (catagory === "best") {
      try {
        const bestStories = await axios.get(
          "https://hacker-news.firebaseio.com/v0/beststories.json"
        );

        const randomIndex = Math.floor(Math.random() * bestStories.data.length);

        const randomBestStory = bestStories.data[randomIndex];

        try {
          const response = await axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${randomBestStory}.json`
          );

          const bestStoryLink = response.data.url;

          await message.say(bestStoryLink);
        } catch (err) {
          console.error(`${err}`.red);
        }
      } catch (err) {
        console.error(`${err}`.red);
      }
    } else if (catagory === "top") {
      try {
        const topStories = await axios.get(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        );

        const randomIndex = Math.floor(Math.random() * topStories.data.length);

        const randomTopStory = topStories.data[randomIndex];
        try {
          const response = await axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${randomTopStory}.json`
          );

          const topStoryLink = response.data.url;

          await message.say(topStoryLink);
        } catch (err) {
          console.error(`${err}`.red);
        }
      } catch (err) {
        console.error(`${err}`.red);
      }
    }
  }
};
