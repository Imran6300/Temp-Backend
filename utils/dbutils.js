const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Root1234:Root1234@airbnb.q6sfnix.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Airbnb"
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  }
};

module.exports = connectDB;
