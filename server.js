'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const morgan = require('morgan');

// import the port and database URL from the config.js file
const {PORT, DATABASE_URL} = require('./config');

const app = express();

// requests that come into /mongoose-blogposts should be routed to router.js
const router = require('./router');
app.use('/blog-posts', router);
//app.use(morgan('common'));

//connect to mongo database
mongoose.connect(DATABASE_URL);


app.listen(PORT, () => {
	console.log(`Your app is listening on ${PORT}`);
})




