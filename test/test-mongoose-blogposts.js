'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const expect = chai.expect;

const {Blogpost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHTTP);

function seedBlogpostData() {
	console.info('seeding restaurant data');
	const seedData = [];

	for (let i = 1; i <= 10; i++) {
		seedData.push(generateBlogpostData());
	}

	return Blogpost.insertMany(seedData);
	//put "random" blogpost documents into the db
	//use Faker library to generate placeholder values for title, content and author
	//(generate these values using the "generate" fcns below)
}

//used to create an object representing a blogpost for seed data for db
//or request.body data
function generateBlogpostData() {
	return {
		title: faker.lorem.sentence(),
		content: faker.lorem.paragraph(),
		author: {firstName: faker.name.firstName(), 
				lastName: faker.name.lastName()}
	};
}

//delete the entire test db
function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}




