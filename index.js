const express = require("express");
const appConf = require("./config/app");
let morgan = require("morgan");
var session = require('express-session');
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const customer = require("./src/customer/v1/Api");
const product = require("./src/product/v1/Api");
const cart = require("./src/cart/v1/Api");
var SQLiteStore = require('connect-sqlite3')(session);
var passport = require('passport');

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

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: '.' })
}));
app.use(passport.authenticate('session'));
// app.use(passport.initialize())

app.use("/v1/customer/", customer);
app.use("/v1/product/", product);
app.use("/v1/cart/", cart);



app.use((err, req, res, next) => {
    res.status(400).json({error:err.stack.split(/\r?\n/)[0]});
   // res.status(400).json({error:err.stack});
});

app.use((req, res, next) => {
    res.status(404).json("404. Sorry can't find that! ");
});
app.listen(appConf.port,()=>{console.log("listening on port: ", appConf.port);});
