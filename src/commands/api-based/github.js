const stripIndent = require("common-tags").stripIndent;
require("colors");

const axios = require("axios").default;
const Commando = require("discord.js-commando");

module.exports = class GitHub extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "github",
      aliases: ["git"],
      group: "api-based",
      memberName: "github",
      description: `
        Get information on a GitHub user or one of their public repositories.
      `,
      examples: ["git <username>", "git <username> <repository>", "git"],
      args: [
        {
          key: "queryUsername",
          prompt: "Which GitHub user do you want to search for?",
          type: "string",
        },
        {
          key: "queryRepository",
          prompt: "Which repository of the user do you want to search for?",
          type: "string",
          default: "",
        },
      ],
    });
  }

  async run(message, args) {
    const { queryUsername, queryRepository } = args;
    const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

    if (queryUsername && !queryRepository) {
      try {
        const API_ENDPOINT = `https://api.github.com/users/${queryUsername}`;

        const response = await axios.request({
          method: "GET",
          url: API_ENDPOINT,
          headers: {
            Authorization: `token ${GITHUB_ACCESS_TOKEN}`,
          },
        });

        const user = response.data;

        const name = user.name;
        const username = user.login;
        const avatar = user.avatar_url;
        const profileURL = user.html_url;
        const bio = user.bio;
        const location = user.location;
        const publicRepositories = user.public_repos;
        const followers = user.followers;
        const following = user.following;
        const createdAt = user.created_at;

        const embed = {
          title: name,
          image: {
            url: avatar,
          },
          url: profileURL,
          color: "#090C10",
          fields: [
            {
              name: `@${username}`,
              value: stripIndent`
                ${bio}

                📔 **Public Repositories** : ${publicRepositories}
                🏃 **Followers** : ${followers}
                🧲 **Following** : ${following}
                🌍 **Location** : ${location}
                🚀 **Joined GitHub** : ${createdAt.slice(0, 10)}
              `,
            },
          ],
        };

        await message.embed(embed);
      } catch (error) {
        message.reply(`Couldn't find the user : ${queryUsername}.`);
      }
    }

    if (queryUsername && queryRepository) {
      try {
        const API_ENDPOINT = `https://api.github.com/repos/${queryUsername}/${queryRepository}`;

        const response = await axios.request({
          method: "GET",
          url: API_ENDPOINT,
          headers: {
            Authorization: `token ${GITHUB_ACCESS_TOKEN}`,
          },
        });

        const repository = response.data;

        const name = repository.full_name;
        const owner = repository.owner.login;
        const ownerProfile = repository.owner.html_url;
        const repositoryURL = repository.html_url;
        const description = repository.description;
        const createdAt = repository.created_at;
        const language = repository.language;
        const forks = repository.forks_count;
        const stars = repository.watchers;
        const lastUpdate = repository.pushed_at;

        const gitHubIcon = `https://i.ibb.co/HDgcbd5/Git-Hub-Mark-120px-plus.png`;

        const embed = {
          title: name,
          url: repositoryURL,
          thumbnail: {
            url: gitHubIcon,
          },
          color: "#090C10",
          fields: [
            {
              name: "Description",
              value: stripIndent`
                ${description ? description : "None"}

                ⏱ **Updated** : ${lastUpdate.slice(0, 10)}
                ⏲ **Created** : ${createdAt.slice(0, 10)}

                👤 **Owner** : [${owner}](${ownerProfile})
                🌟 **Stars** : ${stars}
                🍴 **Forks** : ${forks}
                💻 **Languages** : ${language}
              `,
            },
          ],
        };

        await message.embed(embed);
      } catch (error) {
        message.reply(`
          Couldn't find the repository ${queryUsername}/${queryRepository}. 
          NOTE: Make sure the repository isn't private.
        `);
      }
    }
  }
};
