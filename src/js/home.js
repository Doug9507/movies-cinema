// console.log('hola mundo!');
// const noCambia = "Leonidas";

// let cambia = "@LeonidasEsteban"

// function cambiarNombre(nuevoNombre) {
//   cambia = nuevoNombre
// }
const $actionContainer = document.querySelector("#action");
const $dramaContainer = document.querySelector("#drama");
const $animationContainer = document.querySelector("#animation");
const $horrorContainer = document.querySelector("#horror");

const $modal = document.querySelector("#modal");
const $hideModal = document.querySelector("#hide-modal");
const $modalTitle = $modal.querySelector("h1");
const $modalImage = $modal.querySelector("img");
const $modalDescription = $modal.querySelector("p");
const $modalBody = document.querySelector("#modalBody");

const $overlay = document.querySelector("#overlay");
const $featuringContainer = document.querySelector("#featuring");
const $featuringContainerTwo = document.querySelector(".featuring");
const $form = document.querySelector("#form");
const $home = document.querySelector("#home");
const $userContainer = document.querySelector(".playlistFriends");
const $estrenoContainer = document.querySelector(".myPlaylist");

// const BASE_URL = `https://yts.lt/api/v2/list_movies.json`;
const BASE_URL = `https://yts.mx/api/v2/list_movies.json`;
//${movie.sprites.front_default},${movie.species.name},

function estrenosTemplate(movie) {
	return `<li class="myPlaylist-item">
<a href="#">
  <span>
    ${movie.title}
  </span>
</a>
</li>`;
}

function userTemplate(user) {
	return `<li class="playlistFriends-item"><a href="#">
  <img src=${user.picture.large} />
  <span>
    ${user.name.first} ${user.name.last}
  </span>
</a></li>`;
}

function movieTemplate(movie) {
	return `<div class="primaryPlaylistItem">
  <div class="primaryPlaylistItem-image">
    <img src=${movie.medium_cover_image}>
  </div>
  <h4 class="primaryPlaylistItem-title" style="text-align:center">
    ${movie.title_long}
  </h4>
  </div>`;
}

function modalTemplate(movie) {
	return ` <h1>${movie.title_long}</h1>
  <div class="modal-content">
    <img src=${movie.medium_cover_image} alt="" width="170" height="256">
    <p>${movie.synopsis}</p>
  </div>`;
}

function featuringTemplate(movie) {
	return ` 
  <div class="featuring-image">
  <img src=${movie.small_cover_image} width="70" height="100" alt="">
</div>
<div class="featuring-content">
  <p class="featuring-title"><i>Pelicula encontrada</i></p>
  <p class="featuring-album">${movie.title_long}</p>
</div>`;
}

function createTemplate(HtmlString) {
	const html = document.implementation.createHTMLDocument();
	html.body.innerHTML = HtmlString;
	return html.body.children[0];
}

function addTemplate(listaMovie, $contenedor) {
	$contenedor.querySelector("img").remove();

	listaMovie.forEach((movie) => {
		const HtmlString = movieTemplate(movie);
		const template = createTemplate(HtmlString);
		// $contenedor.append(template)
		$contenedor.appendChild(template);
		const image = template.querySelector("img");
		image.addEventListener("load", (e) => {
			e.srcElement.classList.add("fadeIn");
		});
		eventoClickPelicula(template, movie);
	});
}

function addUser(listUser, $contenedor) {
	listUser.forEach((user) => {
		const htmlString = userTemplate(user);
		const userObject = createTemplate(htmlString);
		$contenedor.appendChild(userObject);
		// $contenedor.innerHTML += htmlString
	});
}
function addEstreno(movieList, $container) {
	movieList.forEach((movie) => {
		const htmlString = estrenosTemplate(movie);
		$container.innerHTML += htmlString;
	});
}
function setAttributes($etiqueta, attributes) {
	// Object.keys(attributes).forEach(element => {
	//   $etiqueta.setAttribute(element,attributes[element])
	// });
	for (let key in attributes) {
		$etiqueta.setAttribute(key, attributes[key]);
	}
}
function buscarPelicula() {
	$form.addEventListener("submit", async (event) => {
		event.preventDefault();
		$home.classList.add("search-active");
		const $loader = document.createElement("img");
		// $loader.setAttribute('src','src/images/loader.gif')
		// $loader.setAttribute('width','70px')
		// $loader.setAttribute('height','70px')
		setAttributes($loader, {
			src: "src/images/loader.gif",
			width: 70,
			height: 70,
		});
		$featuringContainer.append($loader);

		const data = new FormData($form);
		const parametroPelicula = data.get("name");
		const retorno = await getMovie(`${BASE_URL}?limit=1&query_term=${parametroPelicula}`);
		try {
			const template = featuringTemplate(retorno.data.movies[0]);
			$loader.remove();
			$featuringContainerTwo.innerHTML = template;
			// const adjunto = createTemplate(template)
		} catch {
			$featuringContainer.querySelector("img").remove();
			const parrafo = document.createElement("p");
			// parrafo.textContent = 'Algo salio mal!... Vuelve a intentarlo'
			// $featuringContainerTwo.appendChild(parrafo)
			$featuringContainerTwo.innerHTML += `<p><i>Algo salio mal!... Vuelve a intentarlo</i></p>`;
		}
	});
}
function eventoClickPelicula(elemento, movie) {
	elemento.addEventListener("click", function () {
		$overlay.classList.add("active");
		llenarModalInfo(movie);
		$modal.style.animation = "modalIn .8s forwards";
	});
	eventoCerrarModal();
}
function llenarModalInfo(movie) {
	const htmlString = modalTemplate(movie);
	$modalBody.innerHTML = htmlString;
}
function eventoCerrarModal() {
	$hideModal.addEventListener("click", function () {
		$overlay.classList.remove("active");
		$modal.style.animation = "modalOut .4s forwards";
	});
}

async function getUser(url) {
	const response = await fetch(url);
	const user = response.json();
	return user;
}
async function getMovie(url) {
	try {
		const response = await fetch(url);
		const movie = await response.json();
		return movie;
	} catch {
		let error = `Algo salio mal :c`;
		return error;
	}
}
async function cacheExists(category) {
	const listName = `${category}List`;
	const cache = window.localStorage.getItem(listName);
	if (cache) {
		return JSON.parse(cache);
	}
	const {
		data: { movies: data },
	} = await getMovie(`${BASE_URL}?genre=${category}`);
	window.localStorage.setItem(listName, JSON.stringify(data));
	return data;
}
async function cacheUser() {
	const cacheUser = `cacheUSer`;
	const cache = window.localStorage.getItem(cacheUser);
	if (cache) {
		return JSON.parse(cache);
	}
	const { results: data } = await getUser(`https://randomuser.me/api/?results=10`);
	window.localStorage.setItem(cacheUser, JSON.stringify(data));
	return data;
}
async function cacheEstreno() {
	const cacheEstreno = `cacheEstreno`;
	const cache = window.localStorage.getItem(cacheEstreno);
	if (cache) {
		return JSON.parse(cache);
	}
	const {
		data: { movies: data },
	} = await getMovie(`${BASE_URL}?limit=10`);
	window.localStorage.setItem(cacheEstreno, JSON.stringify(data));
	debugger;
	console.log(data);
	return data;
}

async function load() {
	const estrenoList = await cacheEstreno();
	addEstreno(estrenoList, $estrenoContainer);
	const userList = await cacheUser();
	addUser(userList, $userContainer);

	// const {data: {movies : actionList}} = await getMovie(`${BASE_URL}?genre=action`)
	const actionList = await cacheExists("action");
	addTemplate(actionList, $actionContainer);
	// window.localStorage.setItem('listaPeliculaAction',JSON.stringify(actionList))
	// const {data: {movies :dramaList}} = await getMovie(`${BASE_URL}?genre=drama`)
	const dramaList = await cacheExists("drama");
	addTemplate(dramaList, $dramaContainer);
	// window.localStorage.setItem('listaPeliculaDrama',JSON.stringify(dramaList))
	// const {data: {movies :animationList}} = await getMovie(`${BASE_URL}?genre=animation`)
	const animationList = await cacheExists("animation");
	addTemplate(animationList, $animationContainer);
	// window.localStorage.setItem('listaPeliculaAnimation',JSON.stringify(animationList))
	// const {data: {movies :horrorList}} = await getMovie(`${BASE_URL}?genre=horror`)
	const horrorList = await cacheExists("horror");
	addTemplate(horrorList, $horrorContainer);
	// window.localStorage.setItem('listaPeliculaTerror',JSON.stringify(horrorList))

	// const pokemon = await getMovie('https://pokeapi.co/api/v2/pokemon/25');

	// actionList.data.movies.forEach(movie => {
	//   const HtmlString = movieTemplate(movie)
	//   const html = document.implementation.createHTMLDocument()
	//   html.body.innerHTML = HtmlString
	//   $actionContainer.append(html.body.children[0])
	// })
	// dramaList.data.movies.forEach(movie => {
	//   const HtmlString = movieTemplate(movie)
	//   const html = document.implementation.createHTMLDocument()
	//   html.body.innerHTML = HtmlString
	//   $dramaContainer.append(html.body.children[0])
	// })
	// horrorList.data.movies.forEach(movie => {
	//   const HtmlString = movieTemplate(movie)
	//   $horrorContainer.innerHTML += HtmlString
	// })
	// animationList.data.movies.forEach(movie => {
	//   const HtmlString = movieTemplate(movie)
	//   $animationContainer.innerHTML += HtmlString
	// })

	buscarPelicula();

	// addTemplate(actionList.data.movies,$actionContainer)
	// addTemplate(dramaList.data.movies,$dramaContainer)
	// addTemplate(horrorList.data.movies,$horrorContainer)
	// addTemplate(animationList.data.movies,$animationContainer)

	// llenarModalInfo(horrorList.data.movies[8])
	//LLAMADO POKEMON
	// const HtmlString = movieTemplate(pokemon)
	// const html = document.implementation.createHTMLDocument()
	// html.body.innerHTML = HtmlString
	// $actionContainer.append(html.body.children[0])

	// console.log(`Las peliculas que se trajeron de la API son: ${actionList},${dramaList},${animationList},${horrorList}`)
}

load();
