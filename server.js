let express = require("express")
let morgan = require("morgan")
let bodyParser = require("body-parser")
let uuidv4 = require("uuid/v4")

let app = express()
let jsonParser = bodyParser.json()

app.use(express.static("public"))
app.use(morgan("dev"))

var posts = []
posts.push({
	id: uuidv4(),
	title: "JQuery 101",
	content: "JQuery is pretty cool",
	author: "John Resig",
	publishDate: '2019-10-23'
})
posts.push({
	id: uuidv4(),
	title: "JSON for Dummies",
	content: "Actually I like XML better",
	author: "JSON Boi",
	publishDate: '2019-10-23'
})


// Listen
app.listen('8080', () => {
	console.log('App is running on port 8080')
})

// GET
// Return all blog posts
app.get('/blog-posts', (req, res, next) => {
	return res.status(200).json(posts)
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

	let found = false
	let authorPosts = []
	for (post of posts) {
		if (post.author == author) {
			authorPosts.push(post)
			found = true
		}
	}

	if (!found) {
		res.statusMessage = "Author not found"
		return res.status(404).json({
			message: "Author not found",
			status: 404
		})
	}

	console.log('Should be good')
	return res.status(200).json(authorPosts)

})

// POST
app.post('/blog-posts', jsonParser, (req, res, next) => {
	let title = req.body.title
	let content = req.body.content
	let author = req.body.author
	let publishDate = req.body.publishDate

	req.body.id = uuidv4()
	if (!title || !content || !author || !publishDate) {
		res.statusMessage = "Missing field"
		return res.status(406).json({
			message: "Missing field",
			status: 406
		})
	}

	posts.push(req.body)
	return res.status(201).json(req.body)
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

	let found = -1
	for (let i = 0; i < posts.length && found == -1; i++) {
		if (original == posts[i].id) {
			found = i
		}
	}

	let newTitle = newPost.title
	let newContent = newPost.content
	let newAuthor = newPost.author
	let newDate = newPost.publishDate

	if (newTitle) {
		posts[found].title = newTitle
	}
	if (newContent) {
		posts[found].content = newContent
	}
	if (newAuthor) {
		posts[found].author = newAuthor
	}
	if (newDate) {
		posts[found].publishDate = newDate
	}

	return res.status(202).json(posts[found])
})

// DELETE
app.delete('/blog-posts/:id', (req, res, next) => {
	let id = req.params.id

	let found = -1
	for (let i = 0; i < posts.length && found == -1; i++) {
		if (posts[i].id == id) {
			found = i
		}
	}

	if (found == -1) {
		res.statusMessage = "Post not found"
		return res.status(404).json({
			message: "Post not found",
			status: 404
		})
	}

	let removed = posts[found]
	posts.splice(found, 1)
	return res.status(200).json(removed)
})