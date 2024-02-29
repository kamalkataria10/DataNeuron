const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const ConnectionInstance = await mongoose.connect(
      `mongodb://localhost:27017/dataneuron`
    );
    console.log(
      `Connected to MongoDB at host: ${ConnectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
