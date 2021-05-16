const mongoose = require("mongoose");

module.exports = async () => {
  const MONGO_CONNECTION_URI = process.env.MONGO_CONNECTION_URI;

  try {
    const mongoConnection = await mongoose.connect(MONGO_CONNECTION_URI, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log("Connected to MongoDB!".green.bold);

    return mongoConnection;
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};
