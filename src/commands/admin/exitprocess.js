const Commando = require("discord.js-commando");

module.exports = class ExitProcessCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "exitprocess",
      memberName: "exitprocess",
      group: "admin",
      description: "Exits the client process.",
      ownerOnly: true,
      guarded: true,
    });
  }

  async run(message) {
    const exitErrorCode = 0;
    await message.say(`Process exited with error code ${exitErrorCode}.`);
    process.exit(exitErrorCode);
  }
};
