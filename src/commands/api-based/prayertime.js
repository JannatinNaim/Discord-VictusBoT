const { stripIndent } = require("common-tags");
require("colors");

const axios = require("axios");
const Commando = require("discord.js-commando");

module.exports = class PrayerTimeCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "prayertime",
      aliases: ["pt"],
      memberName: "prayertime",
      group: "api-based",
      description: `
        Get Prayer times based on the location.
        NOTE: The country code needs to be a in 2 letters.
      `,
      examples: ["pt <city> <country code>"],
      args: [
        {
          key: "city",
          prompt: "What's the name of the city?",
          type: "string",
        },
        {
          key: "country",
          prompt: "What's the country code?",
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
    const { city, country } = args;

    const RAPID_API_KEY = process.env.RAPID_API_KEY;

    try {
      const API_HOST = "aladhan.p.rapidapi.com";
      const API_ENDPOINT = "https://aladhan.p.rapidapi.com/timingsByCity";

      const response = await axios.request({
        method: "GET",
        url: API_ENDPOINT,
        params: { city: city, country: country },
        headers: {
          "x-rapidapi-key": RAPID_API_KEY,
          "x-rapidapi-host": API_HOST,
        },
      });

      const prayerTimes = response.data.data;

      const sunrise = prayerTimes.timings.Sunrise;
      const sunset = prayerTimes.timings.Sunset;
      const fajr = prayerTimes.timings.Fajr;
      const dhuhr = prayerTimes.timings.Dhuhr;
      const asr = prayerTimes.timings.Asr;
      const maghrib = prayerTimes.timings.Maghrib;
      const isha = prayerTimes.timings.Isha;

      const timezone = prayerTimes.meta.timezone;
      const date = prayerTimes.date.readable;
      const timestamp = prayerTimes.date.timestamp;

      const mosqueIcon = "https://i.ibb.co/71ftNhR/mosque.png";

      const embed = {
        title: `Prayer Timings in ${city.toUpperCase()}`,
        thumbnail: {
          url: mosqueIcon,
        },
        fields: [
          {
            name: date,
            value: timezone,
          },
          {
            name: `PRAYER TIMES`,
            value: stripIndent`
              **Fazr** : ${fajr}
              **Johr** : ${dhuhr}
              **Asr** : ${asr}
              **Maghrib** : ${maghrib}
              **Isha** : ${isha}
              **Sunrise** : ${sunrise}
              **Sunset** : ${sunset}
            `,
          },
        ],
        timestamp: timestamp,
      };

      await message.embed(embed);
    } catch (err) {
      await message.reply(stripIndent`
        Didn't find prayer times for ${city}/${country}.
        NOTE: This function is prone to breaking. So, it might not be your fault.
      `);
    }
  }
};
