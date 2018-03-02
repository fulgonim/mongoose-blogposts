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
	//put "random" blogpost documents into the db
	//use Faker library to generate placeholder values for title, content and author
};

function generateTitle() {
	//generate a random titles for blogposts
};

function generateContent() {
	//generate some random content for blogposts
};

function generateAuthor() {
	//generate a random author name (first and last) for blogposts
};


function generateBlogpostData() {
	//parent function for all "generate" functions
	//used to create an object representing a blogpost for seed data for db
	//or request.body data
}






