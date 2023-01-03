const { initializeApp } = require("firebase/app") 
const { getStorage } = require("firebase/storage") 
require('dotenv').config()

const firebaseConfig = {
    apiKey: process.env.FBASE_API_KEY,
    authDomain: process.env.FBASE_DOMAIN,
    projectId: "staticfile-9a793",
    storageBucket: process.env.FBASE_BUCKET,
    messagingSenderId: "810775382890",
    appId: process.env.FBASE_APP_ID,
    measurementId: "G-GSPX8CDSBD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
// const storage = getStorage(app);

module.exports =app 
