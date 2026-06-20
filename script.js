const API_KEY = "34d82bb44964475e8989b5731f72352c";

const newsContainer = document.getElementById("newsContainer");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const categoryButtons = document.querySelectorAll(".category");


// FETCH NEWS

async function fetchNews(keyword = "technology") {

    loading.classList.remove("hidden");
    error.innerText = "";
    newsContainer.innerHTML = "";

    try {

        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${keyword}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`
        );

        const data = await response.json();

        if (data.status !== "ok") {
            error.innerText = "News service unavailable. Please check API configuration.";
            return;
        }

        displayNews(data.articles);

    }

    catch (err) {

        error.innerText = "Unable to fetch latest news. Please try again.";

    }

    finally {

        loading.classList.add("hidden");

    }
}



// DISPLAY NEWS

function displayNews(articles) {

    newsContainer.innerHTML = "";

    if (!articles || articles.length === 0) {

        newsContainer.innerHTML = "<h2>No News Found</h2>";
        return;

    }


    articles.forEach(article => {

        let date = new Date(article.publishedAt).toDateString();

        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `

        <img 
            src="${article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'}"
            onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c'"
        >

        <div class="content">

           <h3>${article.title}</h3>

           <p><strong>Source:</strong> ${article.source.name}</p>

           <p>
               ${article.description || "No description available"}
           </p>

            <p class="date">${date}</p>

            <a href="${article.url}" target="_blank" class="read-more">
                Read More
            </a>

        </div>

        `;

        newsContainer.appendChild(card);

    });

}



// SEARCH BUTTON

searchBtn.addEventListener("click", () => {

    let keyword = searchInput.value.trim();

    if (keyword) {
        fetchNews(keyword);
    }
    else{
        error.innerText = "Please enter a keyword to search news.";
    }

});



// ENTER KEY SEARCH

searchInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        let keyword = searchInput.value.trim();

        if (keyword) {
            fetchNews(keyword);
        }

    }

});



// CATEGORY BUTTONS

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        let category = button.dataset.category;

        fetchNews(category);

    });

});



// DEFAULT LOAD

fetchNews();