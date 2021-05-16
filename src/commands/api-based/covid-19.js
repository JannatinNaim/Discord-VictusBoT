const stripIndent = require("common-tags").stripIndent;
require("colors");

const axios = require("axios");
const Commando = require("discord.js-commando");

module.exports = class COVID19Command extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "covid-19",
      aliases: ["covid"],
      memberName: "covid-19",
      group: "api-based",
      description: `
        Get COVID-19 Statistics data for all countries.
        Updates are provided by the respected countries.
        NOTE: Data for countries that don't make their COVID-19 Stats
              public can't be show. EG: North-Korea, Syria, etc.
      `,
      examples: ["covid", "covid Bangladesh", "covid-19 USA"],
      throttling: {
        duration: 3,
        usages: 1,
      },
    });
  }

  async run(message, args) {
    const RAPID_API_KEY = process.env.RAPID_API_KEY;
    const queryCountry = args ? args : "all";

    try {
      const RAPID_API_HOST = "covid-193.p.rapidapi.com";
      const API_ENDPOINT = "https://covid-193.p.rapidapi.com/statistics";

      const response = await axios.request({
        method: "GET",
        url: API_ENDPOINT,
        params: { country: queryCountry },
        headers: {
          "x-rapidapi-key": RAPID_API_KEY,
          "x-rapidapi-host": RAPID_API_HOST,
        },
      });

      const countryData = response.data.response[0];

      if (!countryData) {
        message.reply(stripIndent`
            Didn't find a country with the name "${args}". 
            Separate country name spaces with < - >. 
            NOTE: Some countries don't publicly share their COVID-19 Statistics.
          `);
        return;
      }

      const country = countryData.country;
      const population = countryData.population
        ? countryData.population
        : "N / A";
      const newCases = countryData.cases.new;
      const activeCases = countryData.cases.active;
      const criticalCases = countryData.cases.critical;
      const recoveredCases = countryData.cases.recovered;
      const totalCases = countryData.cases.total;
      const newDeaths = countryData.deaths.new;
      const totalDeaths = countryData.deaths.total;
      const totalTests = countryData.tests.total
        ? countryData.tests.total
        : "N / A";
      const updatedAt = countryData.time;

      const COVIDLogo = `https://i.ibb.co/t26dV73/coronavirus-icon.png`;

      const embed = {
        title: country,
        thumbnail: {
          url: COVIDLogo,
        },
        color: "#F01746",
        fields: [
          {
            name: "DETAILS",
            value: stripIndent`
              👪 **POPULATION**
              ${population}

              📊 **CASES**
              
              🌡 New : ${newCases}
              🔵 Active : ${activeCases}
              🔴 Critical : ${criticalCases}
              ⚪ Recovered : ${recoveredCases}
              ➕ Total : ${totalCases}

              ☠ **DEATHS**
              💀 New : ${newDeaths}
              ➕ Total : ${totalDeaths}

              🧪 **TESTS**
              ➕ Total : ${totalTests}
            `,
          },
        ],
        timestamp: updatedAt,
      };

      await message.embed(embed);
    } catch (err) {
      console.error(`${err}`.red);
    }
  }
};
