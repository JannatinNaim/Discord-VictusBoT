require("colors");

module.exports = {
  name: "updateGuildStatus",
  description: "Update the channels in STATS Category.",
  async execute(discordClient) {
    const guildID = process.env.MAIN_DISCORD_SERVER_ID;

    const memberCountChannelID = "837365608948563969";

    const updateMemberCount = (guild) => {
      const channel = guild.channels.cache.get(memberCountChannelID);
      channel.setName(`_members : ${guild.memberCount}`);
    };

    discordClient
      .on("guildMemberAdd", (member) => {
        updateMemberCount(member.guild);
      })
      .on("guildMemberAdd", (member) => {
        updateMemberCount(member.guild);
      });

    const guild = discordClient.guilds.cache.get(guildID);

    try {
      updateMemberCount(guild);
    } catch (err) {
      console.error(`${err}`.red);
    }
  },
};
