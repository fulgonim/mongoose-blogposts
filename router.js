'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Blogpost} = require('./models');

router.use(jsonParser);

// Send JSON response of all blog posts on GET request to /blog-post route
router.get('/', (req, res) => {
	Blogpost
		.find()
		.then(blogposts => {
			res.json({
				blogposts: blogposts.map(
					(blogpost) => blogpost.serialize())
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

//request blogpost by id
router.get('/:id', (req, res) => {
	Blogpost
		.findById(req.params.id)
		.then((blogpost) => res.json(blogpost.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: "Internal server error"});
		});
});


// POST method to add new blogposts 
router.post('/', (req, res) => {
	// required fields for adding a new blogpost
	const requiredFields = ['title', 'author', 'content'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Blogpost
		.create({
			'title': req.body.title,
			'content': req.body.content,
			'author': {'firstName': req.body.author.firstName, 'lastName': req.body.author.lastName}
		})
		.then(blogpost => res.status(201).json(blogpost.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error'});
		});
});


// PUT method to edit existing blogposts
router.put('/:id', (req, res) => {
	if (!(req.params.id === req.body.id)) {
		const message = (
			`Request path id (${req.params.id}) and request body id ` +
			`(${req.body.id}) must match`);
		console.error(message);
		return res.status(400).json({message: message});
	}

	const toUpdate = {};
	const updateableFields = ['title', 'author', 'content'];

	updateableFields.forEach(field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});

	Blogpost
		// $set updates all key/value pairs in "toUpdate"
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(blogpost => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', (req, res) => {
	Blogpost
		.findByIdAndRemove(req.params.id)
		.then(blogpost => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});	

router.use('*', function(req, res) {
	res.status(404).json({message: 'Not Found'});
});







module.exports = router;




