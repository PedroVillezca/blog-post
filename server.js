let express = require("express")
let morgan = require("morgan")
let mongoose = require("mongoose")
let bodyParser = require("body-parser")
let uuidv4 = require("uuid/v4")
let {PostList} = require('./blog-post-model')
const {DATABASE_URL, PORT} = require('./config')

let app = express()
let jsonParser = bodyParser.json()
mongoose.Promise = global.Promise

app.use(express.static("public"))
app.use(morgan("dev"))

// GET
// Return all blog posts
app.get('/blog-posts', (req, res, next) => {
	PostList.getAll()
		.then(posts => {
			return res.status(200).json(posts)
		})
		.catch(error => {
			res.statusMessage = "Something went wrong."
			return res.status(500).json({
				status: 500,
				message: "Something went wrong."
			})
		})
})

// Return blog posts by author
app.get('/blog-post', (req, res, next) => {
	let author = req.query.author

	console.log("In query:")
	console.log(author)

	if (!author) {
		res.statusMessage = "Author not provided"
		return res.status(406).json({message: "Author not provided"})
	}

	PostList.getAuthor(author)
		.then(posts => {
			if (posts) {
				return res.status(200).json(posts)
			} else {
				res.statusMessage = "Author not found."
				return res.status(404).json({
					message: "Author not found.",
					status: 404
				})
			}
		})
		.catch(error => {
			res.statusMessage = "Something went wrong."
			return res.status(500).json({
				status: 500,
				message: "Something went wrong."
			})
		})
})

// POST
app.post('/blog-posts', jsonParser, (req, res, next) => {
	let title = req.body.title
	let content = req.body.content
	let author = req.body.author
	let publishDate = req.body.publishDate
	let id = uuidv4()
	req.body.id = id
	if (!title || !content || !author || !publishDate) {
		res.statusMessage = "Missing field"
		return res.status(406).json({
			message: "Missing field",
			status: 406
		})
	}

	let newPost = {
		id,
		title,
		content,
		author,
		publishDate
	}
	PostList.post(newPost)
		.then(post => {
			return res.status(201).json(post)
		})
		.catch(error => {
			res.statusMessage = "Something went wrong."
			return res.status(500).json({
				status: 500,
				message: "Something went wrong."
			})
		})
})

// PUT
app.put('/blog-posts/:id', jsonParser, (req, res, next) => {
	let original = req.body.original
	let newPost = req.body.new

	if (!original) {
		res.statusMessage = "Missing ID"
		return res.status(406).json({
			message: "Missing ID",
			status: 406
		})
	}

	console.log(original)
	console.log(req.params.id)
	if (original != req.params.id){
		res.statusMessage = "ID does not match"
		return res.status(409).json({
			message: "ID does not match",
			status: 409
		})
	}

	let thisPost = {}
	let newTitle = newPost.title
	let newContent = newPost.content
	let newAuthor = newPost.author
	let newDate = newPost.publishDate

	thisPost.id = req.params.id
	if (newTitle) {
		thisPost.title = newTitle
	}
	if (newContent) {
		thisPost.content = newContent
	}
	if (newAuthor) {
		thisPost.author = newAuthor
	}
	if (newDate) {
		thisPost.publishDate = newDate
	}
	PostList.updatePost(thisPost)
		.then(post => {
			return res.status(202).json(post)
		})
		.catch(error => {
			res.statusMessage = "Something went wrong."
			return res.status(500).json({
				status: 500,
				message: "Something went wrong."
			})
		})
})

// DELETE
app.delete('/blog-posts/:id', (req, res, next) => {
	let id = req.params.id

	PostList.deletePost(id)
		.then(post => {
			if (post) {
				return res.status(200).json(post)
			} else {
				res.statusMessage = "Post not found"
				return res.status(404).json({
					message: "Post not found",
					status: 404
				})
			}
		})
		.catch(error => {
			res.statusMessage = "Something went wrong."
			return res.status(500).json({
				status: 500,
				message: "Something went wrong."
			})
		})
})

let server
function runServer (port, databaseUrl) {
	return new Promise( (resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err)
			} else {
				server = app.listen(port, () => {
					console.log('App is running on port ' + port)
					resolve()
				})
				.on('error', err => {
					mongoose.disconnect()
					return reject(err)
				})
			}
		})
	})
}

function closeServer () {
	return mongoose.disconnect()
		.then(() => {
			return new Promise( (resolve, reject) => {
				console.log('Closing the server')
				server.close(err => {
					if (err) {
						return reject(err)
					} else {
						resolve()
					}
				})
			})
		})
}

runServer(PORT, DATABASE_URL)
	.catch(err => {
		console.log(err)
	})

module.exports = {app, runServer, closeServer}