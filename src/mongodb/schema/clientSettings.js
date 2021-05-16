const mongoose = require("mongoose");

const ClientSettingsSchema = new mongoose.Schema({
  commandPrefix: {
    type: String,
    required: true,
  },
  owner: {
    type: Array,
    required: true,
  },
  invite: {
    type: String,
    required: true,
  },
  presence: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("settings", ClientSettingsSchema);
