// -- ¡¡¡ DAY-NIGHT MODE!!! --

    //SE CAMBIA DE CLASE PARA MOSTRAR EL MENU DESPLEGABLE
    const dropDownBtn = () => {
            document.getElementById("menu-drop-down").classList.toggle("menu-drop-down-show");
            }

    //SE CAMBIA EL HREF PARA MOSTRAR EL DAY STYLESHEET
    const sailorDayBtn = () => {
        document.getElementById('styleSheet').setAttribute("href" , "assets/styles/styles.css")
    }
    //SE CAMBIA EL HREF PARA MOSTRAR EL NIGHT STYLESHEET
    const sailorNightBtn = () => {
        document.getElementById('styleSheet').setAttribute("href" , "assets/styles/stylesng.css")
    }


const myKey = "YvyCqAhxIo7MIgTLdjGgCXJFbVZARHrb";
const pageLimit = 24;

// -- ¡¡¡ SUGGEST SECTION !!! --

//COMPLETAMOS CON STRING LO DE HOY TE SUGERIMOS
    async function getGiphyTendencies (tendencies) {
        let url = 'http://api.giphy.com/v1/gifs/search?q=' + tendencies + '&api_key=' + myKey;
        let resp = await fetch(url);
        let respuestaJson = await resp.json();
        let data = respuestaJson.data
        // let numberArray = toString(parseInt(Math.random() * 25))
        let gifLink = data[0].images.downsized_medium.url
        document.getElementById('gif-suggest-image').src=gifLink;
    }
    datos = getGiphyTendencies('Jonathanvanness')

    //SUGERENCIA 2
    async function getGiphyTendencies2 (tendencies) {
        let url = 'http://api.giphy.com/v1/gifs/search?q=' + tendencies + '&api_key=' + myKey;
        let resp = await fetch(url);
        let respuestaJson = await resp.json();
        let data = respuestaJson.data
        let gifLink = data[0].images.downsized_medium.url
        document.getElementById('gif-suggest-image-2').src=gifLink;
    }
    datos = getGiphyTendencies2('SailorMercury')

    //SUGERENCIA 3
    async function getGiphyTendencies3 (tendencies) {
        let url = 'http://api.giphy.com/v1/gifs/search?q=' + tendencies + '&api_key=' + myKey;
        let resp = await fetch(url);
        let respuestaJson = await resp.json();
        let data = respuestaJson.data
        let gifLink = data[0].images.downsized_medium.url
        document.getElementById('gif-suggest-image-3').src=gifLink;
    }
    datos = getGiphyTendencies3('goku')

    //SUGERENCIA 4
    async function getGiphyTendencies4 (tendencies) {
        let url = 'http://api.giphy.com/v1/gifs/search?q=' + tendencies + '&api_key=' + myKey;
        let resp = await fetch(url);
        let respuestaJson = await resp.json();
        let data = respuestaJson.data
        let gifLink = data[0].images.downsized_medium.url
        document.getElementById('gif-suggest-image-4').src=gifLink;
    }
    datos = getGiphyTendencies4('Unicorn&Rainbows')


// -- ¡¡¡ TENDENCIES SECTION!!! --
// ENDPOINTS
//Creamos la funcion para que me busque las tendencias. 
//Va intentar buscar en el fetch y recorre todo el resultado
//Creamos cada thumb con las img y los titulos sino traemos el error
//despues si se apreta el btn buscar llamamos a la funcion pero 
//con otros parametros
let giphyTrending = 'http://api.giphy.com/v1/gifs/trending?' + '&api_key=' + myKey;

const gifList = async (endpoint, title) => {
	try {
		const res = await fetch(endpoint);
		const list = await res.json();
		let thumb = "";
		list.data.forEach(giphy => {
			thumb += `
				<a class="thumb-search">
					<img src="${giphy.images.fixed_height.url}">
					<span class="title-gradient">
						<h2>#${giphy.title.substring(0 , 30)}...</h2> 
					</span>
                </a>
                <div></div>
			`;
		});
		const giphyTitleDiv = document.getElementById("giphy_id");
		giphyTitleDiv.innerHTML = (title) + ":";
		const giphyListDiv = document.getElementById("giphy_list");
		giphyListDiv.innerHTML = thumb;
	}
	catch (err) {
		console.error("Falló el api al traer el listado.\n", err);
	}
}
gifList(giphyTrending, "Tendencias");


const giphySearchInput = document.getElementById("search-input-square");
const giphySearchInputValue = giphySearchInput.value.toLowerCase();
const giphyListSearch = document.getElementById('history-search');

// -- ¡¡¡ SEARCH SECTION!!! --
const startSearch = () => {
    const giphySearchInput = document.getElementById("search-input-square");
    const giphySearchInputValue = giphySearchInput.value.toLowerCase();
    // console.log(giphySearchInputValue)
    const giphySearch = 'http://api.giphy.com/v1/gifs/search?q=' + giphySearchInputValue + '&api_key=' + myKey;
    gifList(giphySearch, giphySearchInputValue)
    document.getElementById("search-suggests-square").classList.toggle("search-suggests")
    document.getElementById("search-btms").classList.toggle("search-btms")
    location.href="#tendency-section"

    searchLS_Call(giphySearchInput);

    }



//DEFINIMOS EL OBJETO SEARCH
class Search {
    constructor(id , data) {
        this.id = id;
        this.data = data;
    }
}

const searchesLS_FN = () => {
    //creamos array y objeto vacio que despues vamos a sumarle.
    let searchArray = []
    let searchObj = {}

    let name  ;
    let searchLink ;

//recorremos un array y agregamos al objeto search
    for( let i = 0; i < localStorage.length; i++) {
        let item = localStorage.key(i);
        if(item.startsWith("search_")) {
            searchObj = new Search(
                item.slice(7),
                JSON.parse(localStorage.getItem(localStorage.key(i)))
            )
                //agregamos el obj al array
            searchArray.push(searchObj)
        }

        // console.log(searchArray)

        //aca recorremos el array y lo ordenamos con data.date linea125
        searchArray.sort(function(a, b) {
            let dateA = a.data.date;
            let dateB = b.data.date;
            
            return dateB - dateA
        })
    }

    //creo la variable donde le voy a ingresar el codigo html
    let searchesBtn = ""

    //recorro el array donde le agrego cada vez que le recorre el codigo al html
    searchArray.forEach (searches => {
        searchesBtn += `<button class="searchHistoryBtn" data-search="${searches.data.title}" onclick="searchHistoryBtn">${searches.data.title}</button>`
    })

    //vacio el inner html para que cada vez que lo recorre no se pise con el codigo anterior
    giphyListSearch.innerHTML = ""

    //le agrego el codigo html a la funcion.
    giphyListSearch.innerHTML = searchesBtn;

    //el query selector all genera un array de todos los elementos data-search
    // searchLink = document.querySelectorAll("[data-search]");

    // genero un ciclo for para que cuando le haga click al btn me traiga la funcion gifList
    // for (let i=0 ; i < searchLink.length; i++) {
    //     searchLink[i].addEventListener("click" , (e) => {
    //         name = e.target.getAttribute("data-search");
    //         const giphySearch = 'http://api.giphy.com/v1/gifs/search?q=' + name + '&api_key=' + myKey;
    //         gifList(giphySearch,  name);

    //         giphySearchInput.value = name;

    //     }, false)
    // }
}

searchesLS_FN();

function searchLS_Call(searchText) {
    let search_LStoObj = {
        "title":  giphySearchInput.value,
        "date": Date.now(),
    }

    localStorage.setItem(`search_${searchText.value.replace(/\s/g,'_')}`, JSON.stringify(search_LStoObj)); //el value lo transformamos en stringfy pq el value 

    searchesLS_FN();
} 



// -- ¡¡¡ SEARCH SUGGEST SECTION !!! --
//AL APRETAR EL BTN CUANDO APARECE EL LAS SUGERENCIAS DE BUSQUEDAS
const searchRecomendation1 = () => {
    let giphySearchSuggest = 'Argentina'
    // console.log(giphySearchSuggest)
    const giphySearch = 'http://api.giphy.com/v1/gifs/search?q=' + giphySearchSuggest + '&api_key=' + myKey;
    gifList(giphySearch, giphySearchSuggest)
}

const searchRecomendation2 = () => {
    let giphySearchSuggest = 'Messi'
    // console.log(giphySearchSuggest)
    const giphySearch = 'http://api.giphy.com/v1/gifs/search?q=' + giphySearchSuggest + '&api_key=' + myKey;
    gifList(giphySearch, giphySearchSuggest)
}

const searchRecomendation3 = () => {
    let giphySearchSuggest = 'TigerWoods'
    // console.log(giphySearchSuggest)
    const giphySearch = 'http://api.giphy.com/v1/gifs/search?q=' + giphySearchSuggest + '&api_key=' + myKey;
    gifList(giphySearch, giphySearchSuggest)
}

// -- ¡¡¡ SEE-MORE SECTION!!! --
//AL APRETAR EL BTN DE VER MAS, VEMOS LA PALABRA DE LO SUGERIDO
const suggestSearch1 = () => {
    let giphySearchSuggest = 'Jonathan vanness'
    // console.log(giphySearchSuggest)
    const giphySearch = 'http://api.giphy.com/v1/gifs/search?q=' + giphySearchSuggest + '&api_key=' + myKey;
    gifList(giphySearch, giphySearchSuggest);
    location.href='#tendency-section'
}

const suggestSearch2 = () => {
    let giphySearchSuggest = 'Sailor Mercury'
    // console.log(giphySearchSuggest)
    const giphySearch = 'http://api.giphy.com/v1/gifs/search?q=' + giphySearchSuggest + '&api_key=' + myKey;
    gifList(giphySearch, giphySearchSuggest);
    location.href='#tendency-section'

}

const suggestSearch3 = () => {
    let giphySearchSuggest = 'Goku'
    // console.log(giphySearchSuggest)
    const giphySearch = 'http://api.giphy.com/v1/gifs/search?q=' + giphySearchSuggest + '&api_key=' + myKey;
    gifList(giphySearch, giphySearchSuggest);
    location.href='#tendency-section'
}

const suggestSearch4 = () => {
    let giphySearchSuggest = 'Unicorn&Rainbows'
    // console.log(giphySearchSuggest)
    const giphySearch = 'http://api.giphy.com/v1/gifs/search?q=' + giphySearchSuggest + '&api_key=' + myKey;
    gifList(giphySearch, giphySearchSuggest);
    location.href='#tendency-section'
}

// -- ¡¡¡ SEARCH SQUARE SECTION!!! --
// Aca buscamos el input y buscamos el cuadro que va a aparecer. 
// generamos una funcion que cuando el .value sea mayor a 0
// ejecute el la nueva clase y cuando sea menor a cero la esconda
let squareInputUser = document.getElementById('search-suggests-square');
// let giphySearchInput = document.querySelector("#search-input-square");
let giphySearchBtn = document.querySelector("#search-btms");

let showSearchSquare = () => {
    
    if(giphySearchInput.value !== ""){
        squareInputUser.className = "search-suggests-show"
        giphySearchBtn.className = "search-btms-show"
        // console.log('mayor a 0')
        // console.log(giphySearchInput.value)
    } else if (giphySearchInput.value === ""){
        squareInputUser.className = "search-suggests"
        giphySearchBtn.className = "search-btms"
        // console.log('menor a 0')
    }
}

let searchBtnDisplay = () => {
    giphySearchInput.addEventListener("keyup", showSearchSquare)
}

searchBtnDisplay()

const createGifBtn = () => {
    location.href = "./upload.html"
}

