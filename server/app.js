const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.js");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));

app.use("/users", userRouter);

module.exports = { app };
