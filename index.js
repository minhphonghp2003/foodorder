const express = require("express");
const appConf = require("./config/app");
let morgan = require("morgan");
const app = express();
const helmet = require("helmet");

app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

app.get("/", function (req, res) {
  res.json("Hello World");
});

app.use((err, req, res, next) => {
  res.status(400).json(err.stack);
});

app.use((req, res, next) => {
  res.status(404).json("404. Sorry can't find that! ");
});
app.listen(appConf.port);
