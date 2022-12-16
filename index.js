const express = require("express");
const appConf = require("./config/app");
let morgan = require("morgan");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const customer = require("./src/customer/v1/Api");

app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(
    cors({
        origin: appConf.cors,
    })
);
app.options("*", cors());

app.use("/v1/customer/", customer);

app.use((err, req, res, next) => {
    res.status(400).json(err.stack);
});

app.use((req, res, next) => {
    res.status(404).json("404. Sorry can't find that! ");
});
app.listen(appConf.port);
