const debug = require('debug')('s3DB');
const nconf = require('nconf');
const _db = require('./db');
const config = require('./utils/config');

debug('Awesome 🚀 🎉', nconf.get('TITLE'));

module.exports = {
  db: _db
};