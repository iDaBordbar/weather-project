const searchCity = document.getElementById("searchCity");
const cityTitel = document.getElementById("cityTitel");
const countryTitel = document.getElementById("countryTitel");
const timeTitel = document.getElementById("timeTitel");
const tempTitel = document.getElementById("tempTitel");
const weatherIcon = document.getElementById("weatherIcon");
const weatherStatus = document.getElementById("weatherStatus");
const weatherDescription = document.getElementById("weatherDescription");
const humidityTitel = document.getElementById("humidityTitel");
const windSpeed = document.getElementById("windSpeed");
const feelsLikeTitel = document.getElementById("feelsLikeTitel")
const visibilityTitel = document.getElementById("visibilityTitel")


function getWeatherIcon(code, isDay) {

    if (code === 0) return isDay ? "/img/icon/clear-day.svg" : "/img/icon/clear-night.svg";
    if (code === 1) return isDay ? "/img/icon/mostly-clear-night.svg" : "/img/icon/mostly-clear-day.svg";
    if (code === 2) return isDay ? "/img/icon/partly-cloudy-day.svg" : "/img/icon/partly-cloudy-night.svg";
    if (code === 3) return "/img/icon/cloudy.svg";
    if (code <= 48) return "/img/icon/overcast-fog.svg";
    if (code <= 55) return "/img/icon/drizzle.svg";
    if (code <= 65) return "/img/icon/rain.svg"
    if (code <= 77) return "/img/icon/snow.svg";
    if (code <= 82) return "/img/icon/drizzle.svg";
    if (code <= 99) return "/img/icon/thunderstorms-drizzle.svg";
    return isDay ? "/img/icon/clear-day.svg" : "/img/icon/clear-night.svg";


}


function getWeatherStatus(code, isDay) {

    if (code === 0) return isDay ? "Sunny" : "Clear Sky";
    if (code === 1) return isDay ? "Mostly Clear" : "Mostly Clear Night";
    if (code === 2) return isDay ? "Partly Cloudy Day" : "Partly Cloudy Night";
    if (code === 3) return "Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 55) return "Drizzle";
    if (code <= 65) return "Rainy"
    if (code <= 77) return "Snowy";
    if (code <= 82) return "Showers";
    if (code <= 99) return "Thunderstorm";
    return isDay ? "Sunny" : "Clear Sky";

}



function getWeatherDescription(code, isDay) {
    if (code === 0) return isDay ? "It's a clear day. Enjoy the sunshine! ☀️" : "It's a clear day. Enjoy the sunshine! ☀️";
    if (code === 1) return isDay ? "It's a mostly clear day. Pretty nice outside! 🌤️" : "It's a mostly clear night. 🌥️";
    if (code === 2) return isDay ? "It's partly cloudy. Still a nice day outside! ⛅️" : "It's partly cloudy tonight. 🌙";
    if (code === 3) return "It's cloudy outside. Maybe grab a jacket! ☁️";
    if (code <= 48) return "It's foggy outside. Drive carefully! 🌫️";
    if (code <= 55) return "It's drizzling outside. Don't forget your umbrella! 🌦️";
    if (code <= 65) return "It's rainy outside.Enjoy the rain! 🌧️"
    if (code <= 77) return "It's snowy outside. Let's play in the snow! ⛄️";
    if (code <= 82) return "There are showers outside. 🌧️";
    if (code <= 99) return "There's a thunderstorm outside. Stay safe! ⛈️";
    return "Enjoy your day! 🌈";


}


searchCity.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if (searchCity.value.trim() === "") return;
        getWeather();
        searchCity.value = "";
    }
});

const keyApi = "498e063ce2076b66c8fa65ff5f355d73"

async function getWeather() {

    const cityName = searchCity.value;

    const geoResult = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`
    );
    const geoData = await geoResult.json();
    const { latitude, longitude } = geoData.results[0];

    console.log("geoData:", geoData);

    cityTitel.textContent = geoData.results[0].name;
    countryTitel.textContent = geoData.results[0].country;


    const weatherResult = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weather_code&timezone=auto&hourly=relative_humidity_2m,apparent_temperature,visibility`
    );
    const weatherData = await weatherResult.json();

    // console.log(weatherData);
    console.log(weatherResult);



    const timeZone = weatherData.timezone;

    timeTitel.textContent = new Intl.DateTimeFormat("en", {
        timeZone: timeZone,
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date());


    tempTitel.textContent = Math.round(weatherData.current_weather.temperature);


    console.log(weatherData.current_weather.weathercode);


    const code = weatherData.current_weather.weathercode;
    const isDay = weatherData.current_weather.is_day;
    const icon = getWeatherIcon(code, isDay);
    weatherIcon.src = icon;

    weatherStatus.textContent = getWeatherStatus(code, isDay);
    weatherDescription.textContent = getWeatherDescription(code, isDay);


    const humidity = weatherData.hourly.relative_humidity_2m[0];
    humidityTitel.textContent = humidity + "%";

    const wind = weatherData.current_weather.windspeed;
    windSpeed.textContent = Math.round(wind)+ " km/h";

    const feelLike = Math.round(weatherData.hourly.apparent_temperature[0]);
    feelsLikeTitel.textContent = feelLike + " °C";

    const visibility = Math.round(weatherData.hourly.visibility[0] / 1000);
    visibilityTitel.textContent = visibility + " km";
}




