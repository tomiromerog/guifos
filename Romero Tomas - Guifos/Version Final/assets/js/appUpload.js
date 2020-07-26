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

////!!!!!!UPLOAD WEBPAGE!!!!!////////
////!!!!!!UPLOAD WEBPAGE!!!!!////////
////!!!!!!UPLOAD WEBPAGE!!!!!////////

//CREAMOS BOTON PARA QUE APAREZCA CUADRO DE DIALOGO CON CAMARA

const myKey = "YvyCqAhxIo7MIgTLdjGgCXJFbVZARHrb";

//VIDEO CONFIG
const constraintObj = {
    audio: false,
    video: {
        facingMode: "user",
        width: { min: 660, max: 1460},
        height: { min: 538, max: 538}
    }
};

//Paso 1 de crear gif. Autorizamos camara.
const prepareCreateGif = () => {
    document.getElementById("alert-crear-guifos").classList.toggle("alert-crear-guifos-hide");
    document.getElementById("seccion-crear-guifos").classList.toggle("seccion-crear-guifos-camara");
    document.getElementById("pre-capturing-section").classList.toggle("pre-capturing-section-show"); 
    
    navigator.mediaDevices.getUserMedia(constraintObj)
    .then(function(mediaStreamObj){
        let video = document.querySelector('#alert-video-camara');
        if ("srcObject" in video) {
            video.srcObject = mediaStreamObj;
        } 
    
        video.onloadeddata = function(ev) {
            video.play();
        }

    })
    .catch(function(err) {
        console.log(err.name, err.message);
    })
    }

//Paso dos crear gif. Empezamos a filmar
const startCreateGif = () => {
    document.getElementById("pre-capturing-section").classList.remove("pre-capturing-section-show");
    document.getElementById("capturing-section").classList.toggle("capturing-section-show");
    
    navigator.mediaDevices.getUserMedia(constraintObj)
    .then(function(mediaStreamObj){
        let video = document.querySelector('#alert-video-camara2');
        if ("srcObject" in video) {
            video.srcObject = mediaStreamObj;
        } 
    
        video.onloadeddata = function(ev) {
            video.play();
        }

        recorder = RecordRTC(mediaStreamObj, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,

            onGifRecordingStarted: function() {
                console.log('started')
            },
        });

        recorder.startRecording();
        

    })
    .catch(function(err) {
        console.log(err.name, err.message);
    })
}

let getingBlob = '';
let gifUpload_res = '';
let gifId = '';

//Paso 3 de Crear gif. Paramos camara y transformamos video en blob
const stopRecording = () => {
    document.getElementById("capturing-section").classList.remove("capturing-section-show");
    document.getElementById("pre-uploading-section").classList.toggle("pre-uploading-section-show");
    
    recorder.stopRecording();
    getingBlob = recorder.getBlob();
    let video = document.querySelector('#alert-video-camara3');
    video.src = URL.createObjectURL(getingBlob)
    console.log(getingBlob)
}

const repeatRecording = () => {
    document.getElementById("pre-uploading-section").classList.remove("pre-uploading-section-show");
    document.getElementById("pre-capturing-section").classList.toggle("pre-capturing-section-show");
    //TENEMOS QUE ELIMINAR ALGO DEL LOCAL STORAGGE?
}

//Paso 4. Subimos GIF a la API

let guifosArray = [];
let guifosObj = {};


const uploadRecording = async () => {
    document.getElementById("pre-uploading-section").classList.remove("pre-uploading-section-show");
    document.getElementById("uploading-section").classList.toggle("uploading-section-show");
    
    let form = new FormData();
    form.append('file', getingBlob, 'miGuifo.gif');

    try {
        await postGiphyCreate(form);
        if (await gifUpload_res.meta.status === 200) {
            gifId = gifUpload_res.data.id; 

            await gifLS(gifId);
            //aca llamamos a la funcion de local storage

            //Limpiamos array y volvemos a generar.
            guifosArray = [];
            gifLS_items();

        
            console.log("Guifo subido correctamente.")

            // console.log(gifId);

            document.getElementById("uploading-section").classList.remove("uploading-section-show");
            document.getElementById("uploaded-guifo-section").classList.toggle("uploaded-guifo-section-show");        
            let previewVideo = document.getElementById("guifo-uploaded-preview");
            previewVideo.src = URL.createObjectURL(getingBlob);

        }
    }
    catch(error) {
        console.log(error)
    }
}

const postGiphyCreate = async (data) => {
    try {
        const options = {
            method: 'POST',
            body: data,
            json: true
        }

        let URLUpload = 'https://upload.giphy.com/v1/gifs' + '?api_key=' + myKey
        let res = await fetch(URLUpload, options);
        gifUpload_res = await res.json();
        // console.log(gifUpload_res);
        return gifUpload_res;
        
    }
    catch (err) {
        console.error("Falló el api al subir el Gif.\n", err);
    }
}

//Paso 5 Grabamos video en local storage!
const gifLS= async (gif_Id) => {
    //gif_Id viene de la funcion postGiphyCreate

    //HACEMOS UN FETCH DEL GIPHY + EL ID QUE SUBIMOS
    const res = await fetch('https://api.giphy.com/v1/gifs/' + gif_Id + '?api_key=' + myKey);
    //LO TRANSFORMAMOS EN UN OBJETO
    const gif_Obj = await res.json();
    //HACEMOS UN STRINGYFY DEL OBJETO
    const gif_info = JSON.stringify(gif_Obj.data);

    console.log(gif_info)

    //GUARDO EL OBJETO EN EL LOCAL STORAGE PASO 1 DEL LS
    localStorage.setItem(`gif_${gifId}`, gif_info)
}

//creamos clase para traer del local storage
class Guifos {
    constructor(id, data) {
        this.id = id;
        this.data = data;
    }
}

//CREAMOS UNA FUNCION QUE VA A RECORRER EL OBJETO
const gifosList = () => {
    //creamos dos variables para sumarle los thumbs y la cantidad de thumbs que vamos a recorrer
    let thumb = "" ;
    let number = 0;

    // console.log(guifosArray)

    guifosArray.forEach(giphy => {
        number ++ //numero incremental para que agregue clas ede dos columnas.
        thumb += `
        <a class="my-guifo-upload-image">
        <img src="${giphy.id.images.fixed_height.url}">
        </a>
        <div></div>`
        // console.log(thumb);
    });

    let guifoListSection = document.getElementById("my-guifo-list");
    guifoListSection.innerHTML = thumb;
}


//Ahora accedemos a todos los elementos del LS que empiecen con "gif_" y los agregamos al objeto y despues al array para recorrerlo
const gifLS_items = () => {

    for (let i = 0; i < localStorage.length; i++){
        let item = localStorage.key(i);
        if(item.startsWith("gif_")) {
            guifosObj = new Guifos(
                JSON.parse(localStorage.getItem(localStorage.key(i)))
            );
            guifosArray.push(guifosObj);
            gifosList();
        }
    }
}
gifLS_items();

//COPIAMOS ENLACE DEL GUIFO SUBIDO

const copyGifUrl =  () => {
    copyToClipBoard(gifId)
}

function copyToClipBoard (text) {
    const input = document.createElement("textarea");
    document.body.appendChild(input);
    input.value =  `https://giphy.com/gifs/${text}`;
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    alert('Link copiado en portapeles.')
}

const downloadGif = () => {
    downloadGifFn(gifId)
}

function downloadGifFn (text) {
    const input = document.createElement("textarea");
    document.body.appendChild(input);
    input.value =  `https://giphy.com/gifs/${text}`;
    input.select();
    location.href= input.value;

}

const alertBtnCancel = () => {
    location.href = "./index.html"
}
