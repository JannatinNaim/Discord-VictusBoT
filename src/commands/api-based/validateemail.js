const axios = require("axios").default;

const stripIndent = require("common-tags").stripIndent;
require("colors");

const Commando = require("discord.js-commando");

module.exports = class ValidateEmailCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "validateemail",
      aliases: ["valmail"],
      memberName: "validateemail",
      group: "api-based",
      description: `
        Check if an email is valid or note.
        NOTE: This method is not always accurate.
      `,
      args: [
        {
          key: "emailToValidate",
          prompt: "Which email do you want to verify?",
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
    const { emailToValidate } = args;
    const API_ENDPOINT = "https://api.eva.pingutil.com/email";

    try {
      const response = await axios.request({
        method: "GET",
        url: API_ENDPOINT,
        params: {
          email: emailToValidate,
        },
      });

      const emailStats = response.data.data;

      const email = emailStats.email_address;
      const domain = emailStats.domain;
      const isValid = emailStats.valid_syntax;
      const isDeliverable = emailStats.deliverable;
      const isDisposable = emailStats.disposable;
      const spam = emailStats.spam;

      const embed = {
        title: email,
        fields: [
          {
            name: `DETAILS`,
            value: stripIndent`
              **Domain** : ${domain}
              **Valid** : ${isValid}
              **Deliverable** : ${isDeliverable}
              **Disposable** : ${isDisposable}
              **Spam** : ${spam}
            `,
          },
        ],
      };

      await message.embed(embed);
    } catch (err) {
      console.error(`${err}`.red);
    }
  }
};
