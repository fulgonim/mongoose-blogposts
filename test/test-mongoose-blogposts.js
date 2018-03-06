'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const expect = chai.expect;

const {Blogpost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

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

describe('Mongoose Blogposts API resource', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedBlogpostData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});


	// tests for each CRUD endpoint

	describe('GET endpoint', function() {

		it('should return all existing restaurants', function() {


			//strategy:
			//1. get all blogposts returned by GET requests to /blog-posts
			//2. prove response has right status & datatype
			//3. prove # of blogposts we get back is equal to number in database
			// declare res here to use across all calls
			let res;
			return chai.request(app)
				.get('/blog-posts')
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body.blogposts).to.have.length.of.at.least(1);
					return Blogpost.count();
				})
				.then(function(count) {
					expect(res.body.blogposts).to.have.length.of(count);
				});
		});

	});



});










