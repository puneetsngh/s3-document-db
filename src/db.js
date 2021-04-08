const debug = require('debug')('s3DB');
const DB = require('./s3');


const createDB = async ({ database }) => {
  const params = {
    database,
  }
  return await DB.createBucket(params);
}


const deleteDB = async ({ database }) => {
  const params = {
    database,
  }
  return await DB.deleteBucket(params);
}

const getDocument = async ({ database, collection, documentID }) => {
  const params = { database, collection, documentID };
  return await DB.getFromS3(params);
}

const insert = async ({ database, collection, documentID, newDoc, metaData }) => {
  const params = { database, collection, documentID, newDoc, metaData };
  try {
    const checkIfDocExists = await DB.getFromS3(params);
    const error = {
      message: `document with id ${documentID} already exists`,
      statusCode: 400,
      code: 'DUPLICATE_REQUEST'
    }
    if (checkIfDocExists) return Promise.reject(error);
  } catch (err) {
    debug("document doesn't exist, creating new document");
  }
  return await DB.addToS3(params);
}

const remove = async ({ database, collection, documentID }) => {
  const params = { database, collection, documentID };
  return await DB.deleteFromS3(params)
}

const update = async ({ database, collection, documentID, updateDoc, metaData }) => {
  const params = { database, collection, documentID, newDoc: updateDoc, metaData };
  try {
    await DB.getFromS3(params)
    return await DB.addToS3(params);
  } catch (err) {
    return Promise.reject(err);
  }
}


module.exports = {
  createDB,
  deleteDB,
  getDocument,
  insert,
  remove,
  update
};