
'use strict'

const AWS = require('aws-sdk');
const debug = require('debug')('s3DB');
const nconf = require('nconf');

const config = require('./utils/config');

/**
 * @type {AWS.S3}
 */
let S3Storage = null

S3Storage = new AWS.S3({
  // apiVersion: '2012-11-05',
  accessKeyId: nconf.get('AWS_ACCESS_KEY_ID'),
  secretAccessKey: nconf.get('AWS_SECRET_ACCESS_KEY'),
  region: nconf.get('AWS_REGION') || 'ap-southeast-1',
});

const BUCKET_PREFIX = nconf.get('S3_BUCKET_PREFIX') || "";

debug({
  // apiVersion: '2012-11-05',
  accessKeyId: nconf.get('AWS_ACCESS_KEY_ID'),
  secretAccessKey: nconf.get('AWS_SECRET_ACCESS_KEY'),
  region: nconf.get('AWS_REGION') || 'ap-southeast-1',
});

const createBucket = ({ database }) => {
  const params = {
    Bucket: database,
    ACL: "public-read"
  };
  debug(params);
  return new Promise((resolve, reject) => {
    return S3Storage.createBucket(params, function (err, data) {
      if (err) {
        debug({ error: err.message, code: err.code, status: err.statusCode }); // an error occurred
        return reject((err));
      }
      else {
        debug({ data });           // successful response
        return resolve(data);
      }
    });
  });
}

const deleteBucket = ({ database }) => {
  const params = {
    Bucket: database
  };
  return new Promise((resolve, reject) => {
    return S3Storage.deleteBucket(params, function (err, data) {
      if (err) {
        debug({ error: err.message, code: err.code, status: err.statusCode }); // an error occurred
        return reject(err);
      }
      else {
        debug(data);           // successful response
        return resolve(data);
      }         // successful response
    });
  });
}


const addToS3 = ({ database, collection, documentID, newDoc, metaData }) => {
  debug({ database, collection, documentID, newDoc, metaData });
  const bucket = `${BUCKET_PREFIX}${database}`;
  const s3UploadFilePath = `${nconf.get("NODE_ENV")}/${collection}/${documentID}.json`;
  const bufferObject = new Buffer.from(JSON.stringify(newDoc));
  return new Promise((resolve, reject) => {
    return S3Storage.putObject({
      Bucket: bucket,
      Key: s3UploadFilePath,
      Body: bufferObject,
      ACL: "public-read",
      ContentType: metaData.ContentType,
      Metadata: metaData,
      CacheControl: "Cache-Control",
      Expires: 1296000
    }, function (err, data) {
      if (err) {
        debug(err);
        debug({ error: err.message, code: err.code, status: err.statusCode }); // an error occurred
        return reject(err);
      }
      debug('upload to s3 response: ' + JSON.stringify(data))
      return resolve(data);
    });
  });
}

const deleteFromS3 = ({ database, collection, documentID }) => {
  const s3UploadFilePath = `${nconf.get("NODE_ENV")}/${collection}/${documentID}.json`;
  const bucket = `${BUCKET_PREFIX}${database}`;
  const params = {
    Bucket: bucket,
    Key: s3UploadFilePath
  };
  return new Promise((resolve, reject) => {
    return S3Storage.deleteObject(params, function (err, data) {
      if (err) {
        debug({ error: err.message, code: err.code, status: err.statusCode }); // an error occurred
        return reject(err);
      }
      else {
        debug(data);           // successful response
        return resolve(data);
      }
    });
  });
}

const getFromS3 = ({ database, collection, documentID }) => {
  const s3UploadFilePath = `${nconf.get("NODE_ENV")}/${collection}/${documentID}.json`;
  const bucket = `${BUCKET_PREFIX}${database}`;
  const params = {
    Bucket: bucket,
    Key: s3UploadFilePath
  };
  debug(params);
  return new Promise((resolve, reject) => {
    return S3Storage.getObject(params, function (err, data) {
      if (err) {
        debug(err);
        debug({ error: err.message, code: err.code, status: err.statusCode }); // an error occurred
        return reject(err);
      }
      else {
        let jsonResp = JSON.parse(data.Body.toString('utf-8'));        // successful response
        debug(jsonResp);
        return resolve(jsonResp);
      }
    });
  });
}


module.exports = {
  createBucket,
  deleteBucket,
  addToS3,
  deleteFromS3,
  getFromS3,
};
