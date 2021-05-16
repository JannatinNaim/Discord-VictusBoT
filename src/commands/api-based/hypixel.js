const axios = require("axios").default;

const stripIndent = require("common-tags").stripIndent;
require("colors");

const Commando = require("discord.js-commando");

module.exports = class HypixelCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "hypixel",
      memberName: "hypixel",
      aliases: ["hp"],
      group: "api-based",
      description: "Get player stats from Hypixel.",
      args: [
        {
          key: "queryPlayerName",
          prompt: "What player do you want to search for?",
          type: "string",
        },
        {
          key: "gameMode",
          prompt:
            "What game mode's player data you want to search for? (skywars: sw, bedwars: bw, skyblock: sb)",
          type: "string",
        },
      ],
    });
  }

  async run(message, args) {
    const { queryPlayerName, gameMode } = args;

    const NAME_TO_UUID_API_ENDPOINT = `https://api.mojang.com/users/profiles/minecraft/${queryPlayerName}`;

    try {
      const playerUUID = await axios.request({
        method: "GET",
        url: NAME_TO_UUID_API_ENDPOINT,
      });

      if (
        gameMode.toLowerCase() === "skyblock" ||
        gameMode.toLowerCase() === "sb"
      ) {
        await message.say(`https://sky.shiiyu.moe/stats/${queryPlayerName}`);
        return;
      }

      const HYPIXEL_PLAYER_DATA_URL = "https://api.hypixel.net/player";
      const HYPIXEL_API_KEY = process.env.HYPIXEL_API_KEY;

      try {
        const response = await axios.request({
          method: "GET",
          url: HYPIXEL_PLAYER_DATA_URL,
          params: {
            uuid: playerUUID.data.id,
          },
          headers: {
            "API-Key": HYPIXEL_API_KEY,
          },
        });

        const hypixelPlayerData = response.data.player;

        const displayName = hypixelPlayerData.displayname;
        const lastLogin = hypixelPlayerData.lastLogin;
        const lastLogout = hypixelPlayerData.lastLogout;
        const karma = hypixelPlayerData.karma;

        try {
          const HYPIXEL_PLAYER_STATUS_URL = "https://api.hypixel.net/status";

          const playerStatusResponse = await axios.request({
            method: "GET",
            url: HYPIXEL_PLAYER_STATUS_URL,
            params: {
              uuid: playerUUID.data.id,
            },
            headers: {
              "API-Key": HYPIXEL_API_KEY,
            },
          });

          const playerStatus = playerStatusResponse.data.session;

          const playerOnline = playerStatus.online;
          const gameType = playerStatus.gameType;
          const onlineMode = playerStatus.mode;

          const generalInfoField = {
            name: `General Info`,
            value: stripIndent`
              ⏱ **Last Login** : ${new Date(lastLogin).toLocaleDateString(
                "en-US"
              )}
              ⏲ **Last Logout** : ${new Date(lastLogout).toLocaleDateString(
                "en-US"
              )}
              💗 **Karma** : ${karma}
  
              🔵 **Online** : ${playerOnline}
              🎮 **Game Type** : ${gameType}
              🏦 **Game Mode** : ${onlineMode}
            `,
          };

          if (
            gameMode.toLowerCase() === "bedwars" ||
            gameMode.toLowerCase() === "bw"
          ) {
            const bedWarsStats = hypixelPlayerData.stats.Bedwars;

            const bedWarsExpreience = bedWarsStats.Expreience;
            const bedWarsGamesPlayed = bedWarsStats.games_played_bedwars_1;
            const bedWarsCoins = bedWarsStats.coins;
            const bedWarsKills = bedWarsStats.kills_bedwars;
            const bedWarsDeaths = bedWarsStats.deaths_bedwars;
            const bedWarsWins = bedWarsStats.wins_bedwars;
            const bedWarsLosses = bedWarsStats.losses_bedwars;

            const embed = {
              title: `${displayName}'s BedWars Stats`,
              fields: [
                generalInfoField,
                {
                  name: `Stats`,
                  value: stripIndent`
                    ⚗ **Experience**
                    ${bedWarsExpreience}
                    🎰 **Games Played**
                    ${bedWarsGamesPlayed}
                    ✌ **Wins**
                    ${bedWarsWins}
                    👎 **Loss**
                    ${bedWarsLosses}
                    🤺 **Kills**
                    ${bedWarsKills}
                    ☠ **Deaths**
                    ${bedWarsDeaths}
                    👛 **Coins**
                    ${bedWarsCoins}
                  `,
                },
              ],
            };

            await message.embed(embed);
          } else if (
            gameMode.toLowerCase() === "skywars" ||
            gameMode.toLowerCase() === "sw"
          ) {
            const skyWarsStats = hypixelPlayerData.stats.SkyWars;

            const skyWarsGamesPlayed = skyWarsStats.games_played_skywars;
            const skyWarsWins = skyWarsStats.wins;
            const skyWarsLosses = skyWarsStats.losses;
            const skyWarsKills = skyWarsStats.kills;
            const skyWarsAssists = skyWarsStats.assists;
            const skyWarsSouls = skyWarsStats.souls;
            const skyWarsLevel = skyWarsStats.levelFormatted;

            const embed = {
              title: `${displayName}'s SkyWars Stats`,
              fields: [
                generalInfoField,
                {
                  name: `Stats`,
                  value: stripIndent`
                    🚀 **Level**
                    ${skyWarsLevel}
                    🎰 **Games Played**
                    ${skyWarsGamesPlayed}
                    ✌ **Wins**
                    ${skyWarsWins}
                    👎 **Loss**
                    ${skyWarsLosses}
                    🤺 **Kills**
                    ${skyWarsKills}
                    👫 **Assists**
                    ${skyWarsAssists}
                    👻 **Souls**
                    ${skyWarsSouls}
                  `,
                },
              ],
            };

            await message.embed(embed);
          } else {
            await message.reply(
              "Didn't find that gamemode. Please specify only supported gamemodes."
            );
          }
        } catch (err) {
          console.error(`${err}`.red);
        }
      } catch (err) {
        console.error(`${err}`.red);
      }
    } catch (err) {
      await message.reply(
        `Didn't find a user with ${queryPlayerName}. Please try again.`
      );
    }
  }
};
