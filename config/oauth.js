require("dotenv").config();

module.exports = {
    googleCliId: process.env.GOOGLE_CLIENT_ID,
    googleCliSec: process.env.GOOGLE_CLIENT_SECRET,
    fbCliId: process.env.FB_CLIENT_ID,
    fbCliSec: process.env.FB_CLIENT_SECRET,
};
