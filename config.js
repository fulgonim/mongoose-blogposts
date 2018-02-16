'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/mongoose-blogposts-app';
// <UPDATE THIS WITH CORRECT URL> exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/mongoose-blogposts/test-mongoose-blogposts';
exports.PORT = process.env.PORT || 8080;

