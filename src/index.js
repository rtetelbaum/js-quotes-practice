// DOM ELEMENTS

const quoteUl = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")

// EVENT HANDLERS

newQuoteForm.addEventListener("submit", event => {
	event.preventDefault()
	const data = {
		quote: event.target.quote.value,
		author: event.target.author.value
	}
	fetchPostQuote(data)
	event.target.reset()
})

quoteUl.addEventListener("click", event => {
	if (event.target.matches(".btn-danger")) {
		const quoteIDtoDelete = event.target.closest("div").dataset.id
		fetchDeleteQuote(quoteIDtoDelete)
	} else if (event.target.matches(".btn-success")) {
		const quoteIDtoLike = event.target.closest("div").dataset.id
		const data = { quoteId: parseInt(`${quoteIDtoLike}`) }
		fetchPostLikeQuote(data)
	}
})

// FETCHERS

function fetchGetAllQuotes() {
	fetch('http://localhost:3000/quotes?_embed=likes')
		.then(response => response.json())
		.then(data => {
			console.log(data)
			renderAllQuotes(data)
		})
}

function fetchPostQuote(data) {
	fetch('http://localhost:3000/quotes?_embed=likes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data)
			renderOneQuote(data)
		})
}

function fetchDeleteQuote(quoteIDtoDelete) {
	fetch(`http://localhost:3000/quotes/${quoteIDtoDelete}`, {
		method: 'DELETE'
	})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data);
			renderDeleteQuote(quoteIDtoDelete)
		})
}

function fetchPostLikeQuote(data) {
	fetch('http://localhost:3000/likes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data)
			renderLike(data)
		})
}

// RENDERERS

function renderAllQuotes(data) {
	data.forEach(quote => {
		quoteDiv = document.createElement("div")
		quoteDiv.dataset.id = quote.id
		quoteDiv.innerHTML = `
			<li class='quote-card'>
				<blockquote class="blockquote">
					<p class="mb-0">${quote.quote}</p>
					<footer class="blockquote-footer">${quote.author}</footer>
					<br>
					<button class='btn-success'>Likes: <span data-id="${quote.id}">${quote.likes.length}</span></button>
					<button class='btn-danger'>Delete</button>
				</blockquote>
			</li>
		`
		quoteUl.append(quoteDiv)
	})
}

function renderOneQuote(data) {
	quoteDiv = document.createElement("div")
	quoteDiv.dataset.id = data.id
	quoteDiv.innerHTML = `
			<li class='quote-card'>
				<blockquote class="blockquote">
					<p class="mb-0">${data.quote}</p>
					<footer class="blockquote-footer">${data.author}</footer>
					<br>
					<button class='btn-success'>Likes: <span data-id="${data.id}">0</span></button>
					<button class='btn-danger'>Delete</button>
				</blockquote>
			</li>
		`
	quoteUl.append(quoteDiv)
}

function renderDeleteQuote(quoteIDtoDelete) {
	document.querySelector(`div[data-id="${quoteIDtoDelete}"]`).remove()
}

function renderLike(data) {
	const span = document.querySelector(`span[data-id="${data.quoteId}"]`)
	span.textContent = parseInt(span.textContent) + 1
}

// INITIALIZERS

fetchGetAllQuotes()