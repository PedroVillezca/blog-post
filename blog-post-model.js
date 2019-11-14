let mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise

let postSchema = mongoose.Schema({
	id: {type: String},
	title: {type: String},
	content: {type: String},
	author: {type: String},
	publishDate: {type: Date}
})

let Post = mongoose.model('Post', postSchema)

let PostList = {
	getAll: function() {
		return Post.find({})
			.then (posts => {
				return posts
			})
			.catch (error => {
				throw Error(error)
			})
	},
	getId: function(id) {
		return Post.findOne({"id": id})
			.then (post => {
				return post
			})
			.catch (error => {
				throw Error(error)
			})
	},
	getAuthor: function(author) {
		return Post.find({"author": author})
			.then (posts => {
				return posts
			})
			.catch (error => {
				throw Error(error)
			})
	},
	post: function(newPost) {
		return Post.create(newPost)
			.then (post => {
				return post
			})
			.catch (post => {
				throw Error(error)
			})
	},
	updatePost: function(thisPost) {
		return Post.findOneAndUpdate({"id": thisPost.id}, thisPost, {new: true})
			.then (post => {
				return post
			})
			.catch (error => {
				throw Error(error)
			})
	},
	deletePost: function(id) {
		return Post.findOneAndRemove({"id": id})
			.then (student => {
				return student
			})
			.catch (error => {
				throw Error(error)
			})
	}

}

module.exports = {PostList}