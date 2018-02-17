'use strict';

const mongoose = require('mongoose');

// schema that represents a blogpost
const blogpostSchema = mongoose.Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {firstName: {type: String, required: true}, 
			lastName: {type: String, required: true}}
});


blogpostSchema.virtual('authorName').get(function() {
	return `${this.author.firstName} ${this.author.lastName}`.trim()
});

// serialize method to return mongo-generated _id, title, content, and author's first name
blogpostSchema.methods.serialize = function() {
	return {
		id: this._id,
		title: this.title,
		content: this.content,
		author: this.authorName
	};
}







const Blogpost = mongoose.model('Blogpost', blogpostSchema);

module.exports = {Blogpost};


/*{
      "title": "some title",
      "content": "a bunch of amazing words",
      "author": {
          "firstName": "Sarah",
          "lastName": "Clarke"
      }
  }

  */

