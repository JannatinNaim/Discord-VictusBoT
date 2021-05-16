const stripIndent = require("common-tags").stripIndent;
require("colors");

const axios = require("axios");
const Commando = require("discord.js-commando");

module.exports = class SpotifySearchCommand extends Commando.Command {
  constructor(discordClient) {
    super(discordClient, {
      name: "spotify",
      aliases: ["sp"],
      memberName: "spotify",
      group: "api-based",
      description: `
        Search for tracks on Spotify.
        NOTE: Tracks available in the US can be searched for.
      `,
      examples: ["sp something just like this"],
      args: [
        {
          key: "queryTrack",
          prompt: "What track do you want to search for?",
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
    const { queryTrack } = args;

    try {
      const SPOTIFY_CLIENT_ID_SECRET = process.env.SPOTIFY_CLIENT_ID_SECRET;
      const authTokenURL = "https://accounts.spotify.com/api/token";

      const authTokenResponse = await axios.request({
        method: "POST",
        url: authTokenURL,
        params: {
          grant_type: "client_credentials",
        },
        headers: {
          Authorization: `Basic ${SPOTIFY_CLIENT_ID_SECRET}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const spotifyAuthToken = authTokenResponse.data.access_token;

      try {
        const API_ENDPOINT = "https://api.spotify.com/v1/search";

        const response = await axios.request({
          method: "GET",
          url: API_ENDPOINT,
          params: {
            q: queryTrack,
            type: "track",
            limit: 1,
          },
          headers: {
            Authorization: `Bearer ${spotifyAuthToken}`,
          },
        });

        const track = response.data.tracks.items[0];

        if (!track) {
          await message.reply(`Didn't find the track ${queryTrack}.`);
          return;
        }

        let artists = "";

        track.artists.forEach((artist) => {
          artists += artist.name + " | ";
        });

        const durationMinutes = Math.floor(track.duration_ms / 60000);
        const durationSeconds = ((track.duration_ms % 60000) / 1000).toFixed(0);
        const albumName = track.album.name;
        const albumReleaseDate = track.album.release_date;
        const albumCover = track.album.images[0].url;
        const albumTracks = track.album.total_tracks;
        const trackName = track.name;
        const spotifyLink = track.external_urls.spotify;
        const trackDuration =
          durationMinutes +
          ":" +
          (durationSeconds < 10 ? "0" : "") +
          durationSeconds;

        const spotifyLogo =
          "https://i.ibb.co/ryMYvpm/spotify-logo-png-7078.png";

        const embed = {
          title: trackName,
          url: spotifyLink,
          thumbnail: {
            url: spotifyLogo,
          },
          image: {
            url: albumCover,
          },
          color: "#1ED760",
          fields: [
            {
              name: `🎵`,
              value: stripIndent`
                👥 **ARTISTS**
                ${artists}
    
                ⏱ **DURATION** : ${trackDuration}
    
                📚 **${albumName}**
                **Album Tracks** : ${albumTracks}
                **Release Date** : ${albumReleaseDate}
              `,
            },
          ],
        };

        await message.embed(embed);
        await message.say(`Track Preview (Only For Desktop): ${spotifyLink}`);
      } catch (err) {
        console.error(`${err}`.red);
      }
    } catch (err) {
      console.error(`${err}`.red);
    }
  }
};
