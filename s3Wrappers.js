const AWS = require("aws-sdk");
const s3 = new AWS.S3();

function createBucket(bucketParams) {
  return new Promise(function(resolve, reject) {
    s3.createBucket(bucketParams, function(err, data) {
      if (err) {
        console.log("Error creating bucket: ", err);
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
}

function listObjects(params) {
  return new Promise(function(resolve, reject) {
    s3.listObjects(params, function(err, data) {
      if (err) {
        console.log("Error listing objects: ", err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function uploadObject(uploadParams) {
  return new Promise(function(resolve, reject) {
    s3.upload(uploadParams, function(err, data) {
      if (err) {
        console.log("Error uploading to bucket: ", uploadParams.Bucket);
        console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function getObject(bucketParams) {
  return new Promise(function(resolve, reject) {
    s3.getObject(bucketParams, function(err, data) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(JSON.parse(data.Body.toString("utf-8")));
      }
    });
  });
}

function deleteObject(params) {
  return new Promise(function(resolve, reject) {
    s3.deleteObject(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  createBucket: createBucket,
  deleteObject: deleteObject,
  getObject: getObject,
  uploadObject: uploadObject,
  listObjects: listObjects
};
