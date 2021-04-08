'use strict';

let nconf = require('nconf');
const dotenv = require('dotenv');

let initConfig = () => {
  // Load Environment variables from .env file
  dotenv.config({
    // path: '../../../.env'
  });
  // Set up configs
  nconf.use('memory');
  // First load command line arguments
  nconf.argv();
  // Load environment variables
  nconf.env();

  let config = nconf.get();
  return config;
};

module.exports = initConfig();
