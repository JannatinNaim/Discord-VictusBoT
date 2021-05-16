const Commando = require("discord.js-commando");

module.exports = class PokeCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "poke",
      memberName: "poke",
      group: "misc",
      description: "Poke users. Cause, why not?",
      examples: ["poke @user(s)"],
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 10,
      },
    });
  }

  async run(message) {
    let usersToPoke = "";

    if (message.mentions.users) {
      message.mentions.users.forEach((user) => {
        if (user.bot) return;
        else if (user === message.author) return;

        usersToPoke += `<@!${user.id}> `;
      });
    }

    if (usersToPoke === "") {
      await message.reply(
        "Please @mention users to poke. NOTE: User cannot be a bot, me or yourself."
      );
      await message.delete();
      return;
    }

    await message.say(`${usersToPoke}, you've been poked by ${message.author}`);
    await message.delete();
  }
};
