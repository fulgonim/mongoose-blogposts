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
	//(generate these values using the "generate" fcn below)
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
				// .then(function(count) {
				// 	expect(res.body.blogposts).to.have.length.of(count);
				// });
		});

		it('should return blogposts with the right fields', function() {
			//strategy:
			// 1. make sure all blogposts are returned
			// 2. make sure they have expected keys
			let resBlogpost;
			return chai.request(app)
				.get('/blog-posts')
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body.blogposts).to.be.a('array');
					expect(res.body.blogposts).to.have.length.of.at.least(1);

					res.body.blogposts.forEach(function(blogpost) {
						expect(blogpost).to.be.a('object');
						expect(blogpost).to.include.keys(
							'id', 'title', 'content', 'author');
					});
					resBlogpost = res.body.blogposts[0];
					return Blogpost.findById(resBlogpost.id);
				})
				.then(function(blogpost) {
					expect(resBlogpost.id).to.equal(blogpost.id);
					expect(resBlogpost.title).to.equal(blogpost.title);
					expect(resBlogpost.content).to.equal(blogpost.content);
					// expect(resBlogpost.author.firstName).to.equal(blogpost.author.firstName);
					// expect(resBlogpost.author.lastName).to.equal(blogpost.author.lastName);
				});
		});
		// next 'it' block



	});

	describe('POST endpoint', function() {
		//strategy: 
		// 1. make POST request with data
		// 2. prove blogpost we get back has correct keys and 'id' was added
		// (confirming data was successfully inserted into db)

		it('should add a new blogpost', function() {

			const newBlogpost = generateBlogpostData();

			return chai.request(app)
				.post('/blog-posts')
				.send(newBlogpost)
				.then(function(res) {
					expect(res).to.have.status(201);
					expect(res).to.be.json;
					expect(res).to.be.a('object');
					expect(res.body).to.include.keys(
						'id', 'title', 'content', 'author');
					expect(res.body.title).to.equal(newBlogpost.title);

					expect(res.body.id).to.not.be.null;
					expect(res.body.content).to.equal(newBlogpost.content);
					//expect(res.body.author).to.equal(newBlogpost.author);

					return Blogpost.findById(res.body.id);
				})
				.then(function(blogpost) {
					expect(blogpost.title).to.equal(newBlogpost.title);
					expect(blogpost.content).to.equal(newBlogpost.content);
					//expect(blogpost.author).to.equal(newBlogpost.author);
				});
		});
	});

	describe('PUT endpoint', function() {
		//strategy:
		// 1. GET and existing blogpost
		// 2. make PUT request to update this blogpost
		// 3. GET updated blogpost and prove it contains the data sent
		// 4. prove blogpost is in db correctly


		it('should update fields user sends over', function() {
			const updateData = {
				title: 'This is my new YOLO test',
				content: 'THIS IS THE NEW CONTENT FOR THE NEW YOLO TEST'
			};

			return Blogpost
				.findOne()
				.then(function(blogpost) {
					updateData.id = blogpost.id;
					//make request and inspect
					return chai.request(app)
						.put(`/blog-posts/${blogpost.id}`)
						.send(updateData);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
					return Blogpost.findById(updateData.id);
				})
				.then(function(blogpost) {
					expect(blogpost.title).to.equal(updateData.title);
					expect(blogpost.content).to.equal(updateData.content);
				});
		});
	});

	describe('DELETE endpoint', function() {
		// strategy:
		// 1. get a blogpost
		// 2. make DELETE request for the blogpost's id
		// 3. make sure status code is correct
		// 4. prove blogpost doesn't exist in db anymore
		it('should delete a blogpost by id', function() {
			let blogpost;

			return Blogpost
				.findOne()
				.then(function(_blogpost) {
					blogpost = _blogpost;
					return chai.request(app).delete(`/blog-posts/${blogpost.id}`);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
					return Blogpost.findById(blogpost.id);
				})
				.then(function(_blogpost) {
					expect(_blogpost).to.be.null;
				});
		});
	});
});










