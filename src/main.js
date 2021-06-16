window.addEventListener('DOMContentLoaded', function(){
    const APPID = '4e124b029b1ca5698efe9593600b3f5e',
          APIKEY = 'AIzaSyDr6iGcoym0HZEVrwaAkA5Hqz1EJZTVmg4',
          URL = 'https://api.openweathermap.org/data/2.5/weather?q=',
          ciudades = document.getElementById('ciudades'),
          mainBody = document.body.firstElementChild,
          titulo = mainBody.firstElementChild,
          subtitulo = titulo.nextElementSibling,
          mapa = document.getElementById('mapa'),
          icono = document.getElementById('icono'),
          tempMax = document.getElementById('tempMax'),
          tempMin = document.getElementById('tempMin'),
          humedad = document.getElementById('humedad'),
          sTerm = document.getElementById('sTerm'),
          prAtmos = document.getElementById('prAtmos'),
          circulo = document.getElementById('circulo'),
          velVto = document.getElementById('velVto'),
          tantoTiempo = '¡TANTO TIEMPO! <img src="img/Default.svg" id="icono" />';
          var long;
          var lat;

          if (localStorage.getItem('ciudad') === null) {
            resetIndicadores(tempMax,tempMin,humedad,sTerm,prAtmos,velVto);
            titulo.innerHTML = tantoTiempo;
            subtitulo.innerHTML = 'LOCALIZÁ EL CLIMA DE TU CIUDAD';
            ciudades.value = 'Selected';
            circulo.style.opacity = 1;
        } else if (localStorage.getItem('ciudad') === 'Selected'){
            circulo.style.opacity = 1;
            resetIndicadores(tempMax,tempMin,humedad,sTerm,prAtmos,velVto);
            titulo.innerHTML = tantoTiempo;
            subtitulo.innerHTML = 'LOCALIZÁ EL CLIMA DE TU CIUDAD';
        } else if (localStorage.getItem('ciudad') === 'Atlantida'){
            circulo.style.opacity = '1';
            resetIndicadores(tempMax,tempMin,humedad,sTerm,prAtmos,velVto);
        } else {
            circulo.style.opacity = 0;
            lat = localStorage.getItem('lat');
            long = localStorage.getItem('long');
            mapa.src = `https://www.google.com/maps/embed/v1/view?key=${APIKEY}&center=${lat},${long}&zoom=12`;
            ciudades.value = localStorage.getItem('ciudad');
            titulo.innerHTML = localStorage.getItem('titulo');
            subtitulo.innerHTML = localStorage.getItem('subtitulo');
            mainBody.className = localStorage.getItem('mainBody');
            tempMax.innerHTML = localStorage.getItem('tempMax');
            tempMin.innerHTML = localStorage.getItem('tempMin');
            humedad.innerHTML = localStorage.getItem('humedad');
            sTerm.innerHTML = localStorage.getItem('sTerm');
            prAtmos.innerHTML = localStorage.getItem('prAtmos');
            velVto.innerHTML = localStorage.getItem('velVto');
            
        }

    ciudades.addEventListener('change', function(){
        circulo.style.opacity = 0;
        localStorage.setItem('ciudad',ciudades.value);
        buscarCiudad(ciudades.value);
        horaCiudad();
    });

    function buscarCiudad(ciudadBuscada){
        const fetchPromise = fetch(`${URL}${ciudadBuscada}&units=metric&lang=es&appid=${APPID}`);
        
        fetchPromise.then(response => {
            console.log(response);
            //var previo = localStorage.setItem('response', response.json());
            return response.json();
        }).then(result => {
            console.log(result);
            infoClima(result);
            estiloClima(result);
            coordenadas(result);
        }).catch(err => {
            console.log('Ha habido un problema', err);
            if (ciudades.value == 'Selected') {
                titulo.innerHTML = tantoTiempo;
                    localStorage.setItem('titulo',titulo.innerHTML);
                mainBody.className = 'Default';
                    localStorage.setItem('mainBody',mainBody.className);
                subtitulo.innerHTML = 'Seleccioná una ciudad';
                    localStorage.setItem('subtitulo', 'Seleccioná una ciudad');
            } else {
                titulo.innerHTML = `¡Error! <img src="img/Error.svg" id="icono" />`;
                    localStorage.setItem('titulo',titulo.innerHTML);
                mainBody.className = 'Error';
                    localStorage.setItem('mainBody',mainBody.className);
                subtitulo.innerHTML = '¡Caíste! Esa ciudad no existe.';
                localStorage.setItem('subtitulo', '¡Caíste! Esa ciudad no existe.');
            }
            circulo.style.opacity = '1';
                localStorage.setItem('circulo','1');
            resetIndicadores(tempMax,tempMin,humedad,sTerm,prAtmos,velVto);
                localStorage.setItem('tempMax','--');
                localStorage.setItem('tempMin','--');
                localStorage.setItem('humedad','--');
                localStorage.setItem('sTerm','--');
                localStorage.setItem('prAtmos','--');
                localStorage.setItem('velVto','--');
            mapa.src = `https://www.google.com/maps/embed/v1/view?key=${APIKEY}&center=-2.993770,-129.835109&zoom=12`;
            
        });

    }

    function infoClima(data){
        tempMax.innerHTML = `${data.main.temp_max}°`;
        tempMin.innerHTML = `${data.main.temp_min}°`;
        humedad.innerHTML = `${data.main.humidity}<span style="font-size:.5rem;">%</span>`;
        sTerm.innerHTML = `${data.main.feels_like}°`;
        prAtmos.innerHTML = `${data.main.pressure}<span style="font-size:.5rem;">Pa</span>`;
        velVto.innerHTML = `${data.wind.speed}<span style="font-size:.5rem;">km/h</span>`;
            localStorage.setItem("tempMax",data.main.temp_max);
            localStorage.setItem("tempMin",data.main.temp_min);
            localStorage.setItem("humedad",data.main.humidity);
            localStorage.setItem("sTerm",data.main.feels_like);
            localStorage.setItem("prAtmos",data.main.pressure);
            localStorage.setItem("velVto",data.wind.speed);   
    }

    function estiloClima(data) {
        subtitulo.innerHTML = data.weather[0].description;
            localStorage.setItem("subtitulo",data.weather[0].description);

        titulo.innerHTML = `${data.main.temp}º <img src="assets/img/${data.weather[0].main}.svg" id="icono" />`;
            localStorage.setItem("titulo",`${data.main.temp}º <img src="assets/img/${data.weather[0].main}.svg" id="icono" />`);

        mainBody.className = `${data.weather[0].main}`;
            localStorage.setItem("mainBody",data.weather[0].main);
    }

    function coordenadas(data) {
        var long = data.coord.lon;
            localStorage.setItem("long",data.coord.lon);
        var lat = data.coord.lat;
            localStorage.setItem("lat",data.coord.lat);

        horaCiudad(lat,long);
        mapa.src = `https://www.google.com/maps/embed/v1/view?key=${APIKEY}&center=${lat},${long}&zoom=12`;
    }

    function horaCiudad(lat,long) {
        const fetchPromise = fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${long}&timestamp=1331161200&key=${APIKEY}`);

        fetchPromise.then(response => {
            console.log(response);
            return response.json();
        }).then(result => {
            console.log(result);
        }).catch(err => {
            console.log('Ha habido un problema con la hora', err);
        });

    }

    function resetIndicadores(a,b,c,d,e,f) {
        let indicadores = [a,b,c,d,e,f];
        for (let i = 0; i < indicadores.length; i++) {
            indicadores[i].innerHTML = '--';
        }
    }
/*
    function setIndicadores(a,b,c,d,e,f) {
        let indicadores = [a,b,c,d,e,f];
        for (let i = 0; i < indicadores.length; i++) {
            localStorage.setItem(indicadores[i],'--');
        }
    }*/
/*
    function aGuardarAGuardar(a,b,c) {
        `${a}`.`${b}` = a;
        localStorage.setItem(a,a);
    }
*/
    /*function getIndicadores(a,b,c,d,e,f) {


        
        tempMax.innerHTML = localStorage.getItem('tempMax');
            tempMin.innerHTML = localStorage.getItem('tempMax');
            humedad.innerHTML = localStorage.getItem('humedad');
            sTerm.innerHTML = localStorage.getItem('sTerm');
            prAtmos.innerHTML = localStorage.getItem('prAtmos');
            velVto.innerHTML = localStorage.getItem('velVto');
    }*/

});

/*Pacifico -2.993770, -129.835109

*/