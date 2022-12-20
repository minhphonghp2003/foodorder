const { initializeApp } = require("firebase/app") 
const { getStorage } = require("firebase/storage") 

const firebaseConfig = {
    apiKey: "AIzaSyC4DPL618IrHN-qIoLYHT683ZefKvRsMjU",
    authDomain: "staticfile-9a793.firebaseapp.com",
    projectId: "staticfile-9a793",
    storageBucket: "staticfile-9a793.appspot.com",
    messagingSenderId: "810775382890",
    appId: "1:810775382890:web:83607a1de87040449a3313",
    measurementId: "G-GSPX8CDSBD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
// const storage = getStorage(app);

module.exports =app 
