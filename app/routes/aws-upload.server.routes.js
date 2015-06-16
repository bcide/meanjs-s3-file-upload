'use strict';

/**
 * Module dependencies.
 */
var aws = require('../../app/controllers/aws-upload.server.controller');

/**
 * Application routes
 */
module.exports = function(app) {

  // AWS API Routes

  app.get('/aws/config', aws.getClientConfig);
  app.get('/aws/s3Policy', aws.getS3Policy);

};
