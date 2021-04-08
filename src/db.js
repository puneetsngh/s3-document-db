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
  return await DB.addToS3(params);
}

const remove = async ({ database, collection, documentID }) => {
  const params = { database, collection, documentID };
  return await DB.deleteFromS3(params)
}

const update = async ({ database, collection, documentID, document, metaData }) => {

}


module.exports = {
  createDB,
  deleteDB,
  getDocument,
  insert,
  remove,
  update
};