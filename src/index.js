const newQuoteForm = document.querySelector("#new-quote-form")
const quoteList = document.querySelector("#quote-list")
const deleteButton = document.querySelector(".btn-danger")
const quotes = []


function getQuotes(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(json => renderQuotes(json))
}

getQuotes()

function renderQuotes(json) {
    json.forEach(element => {
        quotes.push(element)
        quoteList.innerHTML += `
        <li class='quote-card'>
          <blockquote class="blockquote">
            <p class="mb-0">${element["quote"]}</p>
            <footer class="blockquote-footer">${element["author"]}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${element.likes.length}</span></button>
            <button class='btn-danger'>Delete</button>
          </blockquote>
        </li>
        `
    })
}

newQuoteForm.addEventListener('submit', function(e) {
    e.preventDefault()
    
    quoteList.innerHTML += `
    <li class='quote-card'>
        <blockquote class="blockquote">
            <p class="mb-0">${e.target["new-quote"].value}</p>
            <footer class="blockquote-footer">${e.target["author"].value}</footer>
            <br>
            <button class='btn-success'>Likes: <span>0</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
    </li>
    `
})

quoteList.addEventListener('click', (e) => {
    if (e.target.matches('.btn-danger')) {
        const quote = e.target.closest("li");
        quote.remove();
    }
})

quoteList.addEventListener('click', function(e) {
    if (e.target.matches('.btn-success')) {
        quotes.forEach(element => {
            if (element.author === e.target.parentElement.childNodes[3].innerText) {
                fetch(`http://localhost:3000/likes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        quoteId: element.id
                    })
                })
                .then(resp => resp.json())
                .then(json => {
                    let likes = parseInt(e.target.innerText.split(" ")[1]) + 1
                    e.target.innerText = `Likes: ${likes}`
                })
            }  
        })
    }
})



// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
