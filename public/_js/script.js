function init() {
	manageSubmit()
	manageDelete()
	manageUpdate()
	loadPosts()
}

function loadPosts () {
	fetch('/blog-posts')
		.then(response => {
			if (response.ok) {
				return response.json()
			}
			throw new Error (response.statusText)
		})
		.then(responseJSON => {
			console.log(responseJSON)
			$('#postList').html(``)
			for (let i = 0; i < responseJSON.length; i++) {
				$('#postList').append(
					`<li>
						<p>ID: ${responseJSON[i].id}</p>
						<p>Title: ${responseJSON[i].title}</p>
						<p>Content: ${responseJSON[i].content}</p>
						<p>Author: ${responseJSON[i].author}</p>
						<p>Date: ${responseJSON[i].publishDate}</p>
					</li>`)
			}
		})
		.catch(err => {
			console.log(err)
		})
}

function manageSubmit() {
	$(document).on('click', '#submitButton',(e) => {
		e.preventDefault()
		let post = {
			title: $('#tfTitle').val(),
			content: $('#tfContent').val(),
			author: $('#tfAuthor').val(),
			publishDate: $('#inDate').val()
		}
		$.ajax({
			url: '/blog-posts',
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(post),
			method: "POST",
			success: (responseJSON) => {
				console.log(responseJSON)
				$('#addErrorText').hide()
				loadPosts()
			},
			error: (err) => {
				let message = $('#addErrorText')
				$(message).text(err.statusText)
				$(message).show()
			}
		})
	})
}

function manageDelete() {
	$(document).on('click', '#deleteButton', (e) => {
		e.preventDefault()
		$.ajax({
			url:`/blog-posts/${$('#delID').val()}`,
			method: 'DELETE',
			dataType: 'json',
			contentType: 'application/json',
			success: (responseJSON) => {
				console.log(responseJSON)
				$('#deleteErrorText').hide()
				loadPosts()
			},
			error: (err) => {
				let message = $('#deleteErrorText')
				$(message).text(err.statusText)
				$(message).show()
			}
		})
	})
}

function manageUpdate() {
	$(document).on('click', '#updateButton',(e) => {
		e.preventDefault()
		let newPost = {
			title: $('#upTitle').val(),
			content: $('#upContent').val(),
			author: $('#upAuthor').val(),
			publishDate: $('#upDate').val()
		}
		let requestBody = {
			original: $('#upID').val(),
			new: newPost
		}
		$.ajax({
			url: `/blog-posts/${$('#upID').val()}`,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(requestBody),
			method: "PUT",
			success: (responseJSON) => {
				console.log(responseJSON)
				$('#updateErrorText').hide()
				loadPosts()
			},
			error: (err) => {
				let message = $('#updateErrorText')
				$(message).text(err.statusText)
				$(message).show()
			}
		})
	})
}

console.log('on')
init()


/*
e. Show error messages in case they are sent back as responses.
*/