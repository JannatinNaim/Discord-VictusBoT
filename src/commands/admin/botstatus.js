require("colors");

const clientSettingsSchema = require("../../mongodb/schema/clientSettings.js");

const Commando = require("discord.js-commando");

module.exports = class BotStatusCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "botstatus",
      aliases: ["bs"],
      memberName: "botstatus",
      group: "admin",
      description: `
        Change the status of the bot.
        NOTE: Only valid Discord statuses can be used.
              Use the command without arguments and fill them
              out one by one.
      `,
      args: [
        {
          key: "status",
          prompt: "BOT STATUS : online / idle",
          type: "string",
        },
        {
          key: "activity",
          prompt: "BOT ACTIVITY : watching / playing",
          type: "string",
        },
        {
          key: "statusText",
          prompt: "STATUS TEXT: <string>",
          type: "string",
        },
      ],
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const { status, activity, statusText } = args;

    let newStatus = {
      status: status,
      activity: {
        name: statusText,
        type: activity.toUpperCase(),
      },
    };

    this.client.user.setPresence(newStatus);
    console.log(`Updated Bot Status!`.blue);

    const CLIENT_SETTINGS_DOCUMENT_ID = process.env.CLIENT_SETTINGS_DOCUMENT_ID;
    try {
      await clientSettingsSchema
        .findOneAndUpdate(
          { _id: CLIENT_SETTINGS_DOCUMENT_ID },
          {
            $set: {
              presence: newStatus,
            },
          }
        )
        .exec();
      console.log(`Saved Bot Status options to MongoDB.`);
    } catch (err) {
      console.error(`${err}`.red);
    }
  }
};
