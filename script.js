const searchCity = document.getElementById("searchCity");
const cityTitel = document.getElementById("cityTitel");
const countryTitel = document.getElementById("countryTitel");
const timeTitel = document.getElementById("timeTitel");
const tempTitel = document.getElementById("tempTitel");
const weatherIcon = document.getElementById("weatherIcon");
const weatherStatus = document.getElementById("weatherStatus")



function getWeatherIcon(code, isDay) {

    if (code === 0) return isDay ? "/img/icon/clear-day.svg" : "/img/icon/clear-night.svg";
    if (code <= 2) return isDay ? "/img/icon/mostly-clear-night.svg" : "/img/icon/mostly-clear-day.svg";
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

    if (code === 0) return isDay ? "Sunny": "Clear Sky";
    if (code <= 2) return isDay ? "Mostly Clear" : "Mostly Clear Night";
    if (code === 3) return "Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 55) return "Drizzle";
    if (code <= 65) return "Rainy"
    if (code <= 77) return "Snowy";
    if (code <= 82) return "Showers";
    if (code <= 99) return "Thunderstorm";
    return isDay ? "Sunny" : "Clear Sky";

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
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weather_code&timezone=auto`
    );
    const weatherData = await weatherResult.json();

    console.log(weatherData);


    const timeZone = weatherData.timezone;

    timeTitel.textContent = new Intl.DateTimeFormat("en", {
        timeZone: timeZone,
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date());


    tempTitel.textContent = Math.round(weatherData.current_weather.temperature);


    console.log(weatherData.current_weather.weathercode);

    console.log(cityName, weatherData);

    const code = weatherData.current_weather.weathercode;
    const isDay = weatherData.current_weather.is_day;
    const icon = getWeatherIcon(code, isDay);
    weatherIcon.src = icon;

    weatherStatus.textContent = getWeatherStatus(code, isDay);
}




