const dotenv = require("dotenv");
const connectDB = require("./db/connection.js");
const { app } = require("./app.js");

dotenv.config();

connectDB()
  .then(() => {
    app.listen(5001, () => {
      console.log(`app is running at 5001`);
    });
  })
  .catch((error) => {
    console.log("Mongo DB connection failed", error);
  });
