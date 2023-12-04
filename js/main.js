const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2M2I1ZDNkYTdmMTY5ZjVlNWRlODg5MmUzZjE3YWM5MCIsInN1YiI6IjY1NmJkY2MzNjUxN2Q2MDE1MTY1NGIwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.prglBohhp2xPIZxezC-7r_auOerl6NjQf3C1GxAa42s"

function executeSearch() {
    const searchInput = document.getElementById('searchInput').value;

    if (searchInput.trim() !== '') {
        searchMovies();
    } else {
        alert('Por favor, digite um termo de pesquisa.');
    }
}


function searchTrend() {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=&page=1';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            deleteMovieCards();
            createMovieCard(json);
            toggleVisibility(1);
        })
}

function searchMovies() {
    const movie_name = document.getElementById('searchInput').value;
    const url = `https://api.themoviedb.org/3/search/movie?query=${movie_name}&include_adult=false&language=pt-br&page=1`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            deleteMovieCards();
            createMovieCard(json);
            toggleVisibility(0);
        })
        .catch(err => console.error('error:' + err));
}

function createMovieCard(response) {
    const results = response['results'];
    const div_alo = document.createElement('section');
    div_alo.className = 'divAlo';

    results.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movieCard';
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));

        const title = document.createElement('h2');
        const release_date = document.createElement('h3');
        const vote_average = document.createElement('p');
        const poster = document.createElement('img');
        vote_average.className = 'vote';
        release_date.className = 'date';

        title.textContent = movie.title;
        release_date.textContent = `Data de Lançamento: ${movie.release_date}`;
        vote_average.textContent = `Nota: ${movie.vote_average}`;
        
        const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
        const posterUrl = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/185x278';
        poster.src = posterUrl;
        poster.alt = movie.title;
        poster.classList.add('poster-image');
        poster.style.width = '150px';

        movieCard.appendChild(title);
        movieCard.appendChild(poster);
        movieCard.appendChild(vote_average);
        movieCard.appendChild(release_date);
        div_alo.appendChild(movieCard);
    });
    document.body.appendChild(div_alo);
}

function deleteMovieCards() {
    const divAlo = document.querySelector('.divAlo');
    if (divAlo) {
        divAlo.remove();
    }
}


function showMovieDetails(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?language=pt-br`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(data => {
            const window_file = window.open('movie-details.html', 'movieDetails');

            window_file.onload = function () {
                const body = window_file.document.body;
                populateMovieDatails(data, body);
            };
        })
        .catch(err => console.error('error:' + err));
}



function populateMovieDatails(data, body) {
    console.log(data);
    const div = document.createElement('div');
    const div_data = document.createElement('div')
    const div_genre = document.createElement('div');
    const div_company = document.createElement('div');
    const div_img = document.createElement('div')
    const div_text = document.createElement('div')
    div.className = 'movieInfo';
    div_genre.className = 'divGenre';
    div_company.className = 'divCompany';
    div_data.className = 'divData'
    div_img.className = 'divImg'
    div_text.className = 'divText'

    const title = document.createElement('h1');
    const budget = document.createElement('h3');
    const overview = document.createElement('p');
    const popularity = document.createElement('h3');
    const poster_path = document.createElement('img');
    const release_date = document.createElement('h3');
    const revenue = document.createElement('h3');
    const runtime = document.createElement('h3');
    const tagline = document.createElement('h2');
    const vote_average = document.createElement('h3');

    for (const genre_data of data.genres) {
        const genre = document.createElement('h2');
        genre.textContent = genre_data.name;
        div_genre.appendChild(genre);
    }

    for (const company of data.production_companies) {
        const production_company = document.createElement('h2');
        production_company.textContent = company.name;
        div_company.appendChild(production_company);
    }

    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
    const posterUrl = data.poster_path ? `${imageBaseUrl}${data.poster_path}` : 'https://via.placeholder.com/185x278';

    title.textContent = data.title;
    tagline.textContent = data.tagline;
    overview.textContent = data.overview;   
    poster_path.src = posterUrl;
    poster_path.alt = data.title;
    poster_path.classList.add('poster-image');
    poster_path.style.width = '150px';
    release_date.textContent = `Data de Lançamento: ${data.release_date}`;
    runtime.textContent = `Duração: ${data.runtime} Minutos`;
    budget.textContent = `Orçamento: $${data.budget}.00`;
    revenue.textContent = `Lucro: $${data.revenue}.00`;
    popularity.textContent = `Popularidade: ${data.popularity}`;
    vote_average.textContent = `Nota Média: ${data.vote_average}`;

    div_text.appendChild(title);
    div_text.appendChild(overview);
    div_img.appendChild(poster_path);
    div_img.appendChild(tagline);
    div_text.appendChild(release_date);
    div_text.appendChild(runtime);
    div_text.appendChild(budget);
    div_text.appendChild(revenue);
    div_text.appendChild(popularity);
    div_text.appendChild(vote_average);
    div_data.appendChild(div_img);
    div_data.appendChild(div_text);
    div.appendChild(div_data);
    div.appendChild(div_genre);
    div.appendChild(div_company);

    body.appendChild(div);

}

function toggleVisibility(number) {
    const popularMoviesSection = document.getElementById('popularMovies');
    if (number === 1) {
        popularMoviesSection.style.display = 'block'
    } else {
        popularMoviesSection.style.display = 'none'
    }
}