require("dotenv").config();
require("colors");

const path = require("path");

const { oneLine } = require("common-tags");

const Commando = require("discord.js-commando");

const mongoConnection = require("./src/mongodb/mongoConnection.js");
const clientSettingsSchema = require("./src/mongodb/schema/clientSettings.js");

const CLIENT_SETTINGS_DOCUMENT_ID = process.env.CLIENT_SETTINGS_DOCUMENT_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

(async () => {
  try {
    console.log(`Initializing Discord Client...`.brightWhite);

    await mongoConnection();

    const clientSettings = await clientSettingsSchema.findById(
      CLIENT_SETTINGS_DOCUMENT_ID
    );

    const discordClient = new Commando.CommandoClient({
      commandPrefix: clientSettings.commandPrefix,
      owner: clientSettings.owner,
      invite: clientSettings.invite,
      presence: {
        status: clientSettings.presence.status,
        activity: {
          name: clientSettings.presence.activity.name,
          type: clientSettings.presence.activity.type,
        },
        afk: clientSettings.presence.afk,
      },
    });

    discordClient.login(BOT_TOKEN);

    discordClient
      .on("ready", () => {
        console.log(
          oneLine`
        Discord Client, ready! 
        Logged in as ${discordClient.user.username}#
        ${discordClient.user.discriminator} 
        (${discordClient.user.id})
      `.green.bold
        );
      })

      .on("error", (err) => {
        console.error(`${err}.red`);
      })

      .on("warn", (info) => {
        console.warn(`${info}`.yellow);
      })

      .on("disconnect", () => {
        console.warn("Disconnected!".yellow);
      })

      .on("reconnecting", () => {
        console.warn("Reconnecting...".yellow);
      });

    const DEBUG_MODE = process.env.DEBUG_MODE;

    if (DEBUG_MODE === "true") {
      discordClient.on("debug", (debug) => {
        console.debug(`${debug}`.magenta);
      });
    }

    discordClient.registry
      .registerDefaultGroups()
      .registerDefaultTypes()
      .registerDefaultCommands({
        unknownCommand: false,
      })

      .registerGroups([["misc", "MISC Commands"]])

      .registerCommandsIn(path.join(__dirname, "src", "commands"));
  } catch (err) {
    console.error(`${err}`.red);
  }
})();
