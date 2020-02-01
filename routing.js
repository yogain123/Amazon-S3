const express = require("express");
const router = express.Router();

const multer = require("multer");
const multipart = multer().any();

var AWS = require("aws-sdk");
var region = "ap-south-1";
let configObjAWS = {
  region,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey
};

AWS.config.update(configObjAWS);
const s3 = new AWS.S3();

router.get("/checkNext", (req, res, next) => {
  let error = false;
  if (error) {
    return next();
  }
  return res.send("okkk");
});

// this will only and only and only be invoked with next is called with parameter like next(something)
router.use((err, req, res, next) => {
  console.log(err); // { error: "erroororro " })
  return res.send("From middleware okkk");
});

router.get("/get/getSignedUrl", (req, res, next) => {
  var params = { Bucket: "personal-123", Key: "images/lol.jpg" };
  s3.getSignedUrl("getObject", params, (err, url) => {
    if (err) {
      return res.send("error");
    }
    return res.send({ url });
  });
});

router.get("/post/getSignedUrl", (req, res, next) => {
  var params = { Bucket: "personal-123", Key: "images/yogendra.jpg" };
  s3.getSignedUrl("putObject", params, (err, url) => {
    if (err) {
      return res.send("error");
    }
    return res.send({ url });
  });
});

router.post("/uploadFile", multipart, async (req, res, next) => {
  try {
    let file = req.files[0];
    file = file.buffer;
    var params = {
      Body: file,
      Bucket: "personal-123",
      Key: "HappyFaceee.jpg"
    };
    let result = await s3.putObject(params).promise();
    res.send(result);
  } catch (error) {
    res.send("Errro");
  }
});

module.exports = router;
