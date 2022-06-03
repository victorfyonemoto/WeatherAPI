const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentInfoEl = document.getElementById('current_weather_info');
const timeZone = document.getElementById('time_zone');
const cityName = document.getElementById('cityName');
const weatherForecastEl = document.getElementById('weather_forecast');
const currentTempEl = document.getElementById('current_temp');
const clearHistory = document.getElementById('clearbtn');
const saveButton = document.getElementById('savebtn');
let dataWeather = [];
let savedDays = [];
let weatherData;

const dateOptions = { weekday: "long", year: 'numeric', month: 'long', day: 'numeric' };

const daysWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setInterval(() => {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hours12hFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hours12hFormat < 10? '0'+hours12hFormat : hours12hFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am_pm">${ampm}</span>`;

    dateEl.innerHTML = daysWeek[day] + ', ' + date+ ' ' + months[month] + ' - ' + year

}, 1000);

const API_KEY = '6a0b2e915b42d615de8e364b52eb20d0';

async function getWeatherData () {

    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude} = success.coords;

         fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
         
         .then(response => response.json())
         
         .then(data => {

        console.log(data);
        showWeatherData(data);
        //localStorage
        console.log(dataWeather);
        dataWeather.push(data);
        savedDays.push()
        })

    })

}

window.addEventListener('load', () => { 
    if('geolocation' in navigator){
    getWeatherData();
    }else{
        alert('Unexpected Error');
        function showError(error) {
            alert(`Unexpected error - check console.log for details`);
            console.log(`Error: ${error.message}`);
        }
        showError();
    }
})


function showWeatherData (data){

    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timeZone.innerHTML = data.timezone;
    cityName.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentInfoEl.innerHTML = 

    `<div class="weather_item">
        <div> Humidity </div>
        <div> ${humidity}% </div>
    </div>
    <div class="weather_item">
        <div> Presssure </div>
        <div> ${pressure} hPa </div>
    </div>
    <div class="weather_item">
        <div> Wind Speed </div>
        <div> ${wind_speed} m/s </div>
    </div>
    <div class="weather_item">
        <div> Sunrise </div>
        <div> ${window.moment(sunrise * 1000).format('HH:mm a')} </div>
    </div>
    <div class="weather_item">
        <div> Sunset </div>
        <div> ${window.moment(sunset*1000).format('HH:mm a')} </div>
    </div>`;
    
    
    let futureForecast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
                <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="${day.weather[0].description}" class="w_icon">
                <div id="current">
                    <div class="day">
                        ${window.moment(day.dt*1000).format('dddd')}
                    </div>
                    <div class="descriptionDay" id="description_current">
                        ${day.weather[0].description} 
                    </div>
                    <div class="temp">
                        Day ${day.temp.day}ºC
                    </div>
                    <div class="temp">
                        Night ${day.temp.night}ºC
                    </div>
                </div>`
        }else{
            futureForecast += `
            <div class="next_weather_forecast">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}" class="w_icon">
                <div class="descriptionDay"> ${day.weather[0].description} </div>
                <div class="temp">Day ${day.temp.day}ºC</div>
                <div class="temp">Night ${day.temp.night}ºC</div>
            </div>`
        }
    })


    weatherForecastEl.innerHTML = futureForecast;

}



function saveHistory(){

    
    localStorage.setItem("weathers", JSON.stringify(weatherData));
    
}

function renderHistory (){
    
    weatherData.forEach((weather) => {
        document.getElementById('savedWeather').innerHTML = `
        <div id ="history">
        <img src = "http://openweathermap.org/img/wn/${weatherData[0].daily[0].weather[0].icon}@2x.png" alt =       " ">
            Day ${weatherData[0].daily[0].temp.day}ºC
            Night ${weatherDatar[0].daily[0].temp.night}ºC
            ${weatherData[0].daily[0].weather[0].description}
            </div>`
            
        })
}

/* 
function clearHistory() {

    if (dataWeather.length == 0) {
      alert('Não há histórico a ser apagado')
    } else {
      localStorage.clear('dataWeather');
      verifyLocalStorage();
      alert(`O histórico foi apagado com sucesso`);
    }

} */