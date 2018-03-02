'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/mongoose-blogposts-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-mongoose-blogposts';
exports.PORT = process.env.PORT || 8080;

