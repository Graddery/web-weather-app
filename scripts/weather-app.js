function removePrev(sselector){
  const prevElem = document.querySelector(sselector);
  if(prevElem) prevElem.remove();
}

function showWeatherInfoBlock(nameCity, temp, description, fileName, speedWind){
  let temp_c = Math.floor(temp);
  removePrev('#weather-api');
  const htmlBlock = 
  `<div class="weather-api-block" id="weather-api">
    <p class="weather-api-block__city">${nameCity}</p>
    <div class="weather-api-container">
      <div class="weather-api-container__info">
        <img class="api-container__image" src="${fileName}" alt="icon-weather" id="icon-weather">
        <p class="api-container__temp">Температура: ${temp_c}°C</p>
      </div>
      <div class="weather-api-container__info">
        <p class="api-container___data">Cостояние: ${description}</p>
        <p class="api-container___data">Скорость ветра: ${speedWind} м/c</p>                           
      </div>
    </div>
  </div>`;
  document.querySelector('#map').insertAdjacentHTML('beforebegin', htmlBlock);
}

function showMap(lat, lon){
	ymaps.ready(init);
	function init(){
		var myMap = new ymaps.Map("map", {
			center: [lat, lon],
			zoom: 7
		}, {
      searchControlProvider: 'yandex#search'
  });

    myMap.geoObjects
      .add(new ymaps.Placemark([lat, lon], {
        preset: 'islands#icon',
        iconColor: '#0095b6'
    }))
	}
}
  

async function getWeatherData(lat, lon){
  const query = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=22d58716ed38e1e848505a9612dafdf4&lang=ru`;
  const responce = await fetch(query);
  const data = await responce.json();

  if(data.cod == '400'){
    alert('Неверный ввод координат.');
  }
  return data;
}

document.querySelector('.info-about-weather__form').onsubmit = async function(e){
  e.preventDefault();
  lat = document.querySelector('#inputLat').value.trim();
  lon = document.querySelector('#inputLat').value.trim();
  const data = await getWeatherData(lat,lon);
  const icon = data.weather[0].icon;
  const description = data.weather[0].description;
  const fileName = "https://openweathermap.org/img/w/" + icon + ".png"; //import icons from api
  showMap(lat, lon);
  showWeatherInfoBlock(data.name, data.main.temp, description, fileName, data.wind.speed);
}