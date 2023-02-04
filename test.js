const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const path = require("path");
const jwtConf = require("./config/jwt");

const fs = require("fs");
// const privateKey = fs.readFileSync(path.join(jwtConf.keyFolder, "rsa.key"));
// const publicKey = fs.readFileSync(path.join(jwtConf.keyFolder, "rsa.pub.pem"));
let privateKey
let run = async () => {
    await (async() =>{
        privateKey = await s3
           .getObject({
               Bucket: "cyclic-bunny-pinafore-ap-southeast-2",
               Key: "pubRsa",
           })
           .promise();
       console.log(privateKey.Body.toString());

    })()
    console.log(privateKey);
};
run()
