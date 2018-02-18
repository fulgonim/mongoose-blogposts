'use strict';

const express = require('express');

//import body-parser to enable parsing of json in requests
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//const morgan = require('morgan');

// import the port and database URL from the config.js file
const {PORT, DATABASE_URL} = require('./config');

const app = express();

// requests that come into /mongoose-blogposts should be routed to router.js
const router = require('./router');
app.use('/blog-posts', router);
//app.use(morgan('common'));

// declare a global 'server' object for runServer and closeServer functions
let server;

// connect to database and then start the server
function runServer(databaseURL, port = PORT) {

	return new Promise((resolve, reject) => {
		mongoose.connect(databaseURL, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${PORT}`);
				resolve();
			})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

// close server and return a promise (for integration tests)
function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
