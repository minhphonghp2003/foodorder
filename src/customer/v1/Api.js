const express = require("express");
const ctrler = require("./Controller").default;
const oauthConfig = require("../../../config/oauth");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oidc");
var FacebookStrategy = require('passport-facebook').Strategy;
const { checkAuth } = require("../../../middleware/checkAuth");

const router = express.Router();
router.get("/login/google", passport.authenticate("google"));
router.get(
    "/oauth/redirect/google",
    passport.authenticate("google", {
        failureRedirect: "/v1/customer/oauthfailurejson",
    }),
    ctrler.oauthSuccess
);

router.get("/login/facebook", passport.authenticate("facebook"));
router.get(
    "/oauth/redirect/facebook",
    passport.authenticate("facebook", {
        failureRedirect: "/v1/customer/oauthfailurejson",
    }),
    ctrler.oauthSuccess
);
router.get("/oauthfailurejson",ctrler.oauthFailure)
router.get("/profile", checkAuth, ctrler.getProfile);
router.get("/address", checkAuth, ctrler.getCustomerAddress);
router.get("/email", ctrler.getEmail);
router.post("/login", ctrler.login);
router.post("/register", ctrler.register);
router.post("/address", checkAuth, ctrler.createCustomerAddress);
router.post("/webhook", (req,res)=>{
    console.log("webhook");
    res.send("webhook")
})
router.delete("/address", checkAuth, ctrler.deletaAddress);
router.post("/emailentry", ctrler.createEmailForChange);
router.put("/password", ctrler.changePassword);
router.put("/profile", checkAuth, ctrler.changeProfile);
router.put("/defaultaddress", checkAuth, ctrler.changeDefaultAddress);
router.put("/address", checkAuth, ctrler.changeAddressDetail);
module.exports = router;

passport.use(
    new GoogleStrategy(
        {
            clientID: oauthConfig.googleCliId,
            clientSecret: oauthConfig.googleCliSec,
            callbackURL: "/v1/customer/oauth/redirect/google",
            scope: ["profile", "email"],
        },
        ctrler.passportGoogleVerify
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: oauthConfig.fbCliId,
            clientSecret: oauthConfig.fbCliSec,
            callbackURL: "/v1/customer/oauth/redirect/facebook",
            scope: ["email"],
        },
        ctrler.passportFbVerify
    )
);



passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username, name: user.name });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
