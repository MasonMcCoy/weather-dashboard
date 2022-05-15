var key = "cc82ba65ca932ac8748f141a8908c5f9";

var srchBtn = $("#search-bttn");
var srchHistory = $("#search-history");
var weatherInfo = $("main");
var forecastHead = $("<h3>").text("5-Day Forecast").attr("id", "forecast-head");
var forecast = $("<div>").attr("id", "forecast");

// API request that returns the name, latitude, and longitude of a given city
function getCoor() {
    // Captures user input
    var city = $("#search-input").val();
    var baseURL = "https://api.openweathermap.org/data/2.5/weather";
    var call = baseURL + "?q=" + city + "&appid=" + key;
    


    $.ajax({url: call, success: function(response) {
        getWeather(response.coord, response.name);
        console.log(response.coord);
        storeSearch(city, JSON.stringify(response.coord));
    }})
}

// API request that returns current weather information
function getWeather(coordinates, city) {
    var baseURL = "https://api.openweathermap.org/data/2.5/onecall";
    var lat = coordinates.lat;
    var lon = coordinates.lon;
    var call =  baseURL + "?lat=" + lat + "&lon=" + lon +
    "&exclude=minutely,hourly,alerts&appid=" + key + "&units=imperial";

    $.ajax({url: call, success: function(response) {
        // Date
        var currentDate = unixDate(response.current.dt);

        // Weather Icon
        var currentIcon = response.current.weather[0].icon;

        // Temperature
        var currentTemp = response.current.temp;
        
        // Humidity
        var currentHum = response.current.humidity;
        
        // Wind Speed
        var currentWind = response.current.wind_speed;
        
        // UV Index
        var currentUV = response.current.uvi;

        // Clears out any rendered weather data
        weatherInfo.text("");
        forecast.text("");

        // Render current weather data
        renderWeather(currentDate, currentIcon, currentTemp, currentHum, currentWind, currentUV, city);

        // Render 5-Day Forecast
        for (var i = 1; i < 6; i++) {
            var dailyDate = unixDate(response.daily[i].dt);
            var dailyIcon = response.daily[i].weather[0].icon;
            var dailyTemp = response.daily[i].temp.day;
            var dailyWind = response.daily[i].wind_speed;
            var dailyHum = response.daily[i].humidity;
            
            renderWeather(dailyDate, dailyIcon, dailyTemp, dailyWind, dailyHum);
        }
        weatherInfo.append(forecastHead);
        weatherInfo.append(forecast);
    }})

}

// Creates DOM elements, assigns API data to them, and appends them to the page
function renderWeather(date, icon, temp, hum, wind, uv, city) {
    var currentCard = $("<div>");
    var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    
    // Renders current weather
    if (city) {
        currentCard.attr("id", "current-weather");
        currentCard.append($("<h2>").text(city));
        currentCard.append($("<p>").text(date));
        currentCard.append($("<img>").attr("src", iconURL));
        currentCard.append($("<p>").text("Temp: " + temp + "°F"));
        currentCard.append($("<p>").text("Wind: " + wind + " MPH"));
        currentCard.append($("<p>").text("Humidity: " + hum + "%"));
        
        // Conditional logic to color UV conditions
        if (uv <= 4) {
            // Favorable UV
            currentCard.append($("<p>").text("UV Index: ").append($("<span>").text(uv).attr("class", "favorable")));
        } else if (uv <= 6) {
            // Moderate UV
            currentCard.append($("<p>").text("UV Index: ").append($("<span>").text(uv).attr("class", "moderate")));
        } else {
            //Severe UV
            currentCard.append($("<p>").text("UV Index: ").append($("<span>").text(uv).attr("class", "severe")));
        }

        weatherInfo.append(currentCard);
    } else {
        currentCard.attr("class", "daily-weather");
        currentCard.append($("<p>").text(date));
        currentCard.append($("<img>").attr("src", iconURL));
        currentCard.append($("<p>").text("Temp: " + temp + "°F"));
        currentCard.append($("<p>").text("Wind: " + wind + " MPH"));
        currentCard.append($("<p>").text("Humidity: " + hum + "%"));

        // Adds daily weather cards to forecast element
        forecast.append(currentCard);
    }
}

// Converts a unix timestamp into a readable date
function unixDate(timestamp) {
    var date = new Date(timestamp * 1000);
    var month = date.getMonth() + 1;
    return month + "/" + date.getDate() + "/" + date.getFullYear();
}

// Stores searches in Local Storage
function storeSearch(searchTerm, callURL) {
    localStorage.setItem(searchTerm, callURL);
}

// Calls API using previous search query
function renderHistory() {
    for (var i = 0; i < localStorage.length; i++) {
        var historyBtn = $("<button>").attr("class", "btn history-button");
        var prevSearch = localStorage.key(i);
        var prevCall = localStorage.getItem(localStorage.key(i));
    
        historyBtn.text(prevSearch);
        historyBtn.attr("data-city", prevSearch)
        historyBtn.attr("data-coord", prevCall)

        // historyBtn.on("click", getCoor(prevSearch, prevCall));
        srchHistory.append(historyBtn);
    }
}

function callPrev(event) {
    if (event.target.tagName != "BUTTON") {
        return
    }

    JSON.parse(event.target.dataset.coord)

    getWeather(JSON.parse(event.target.dataset.coord), event.target.dataset.city);
}


// Renders previous searches from Local Storage when the application loads
$(document).ready(renderHistory);

srchHistory.on("click", callPrev);

srchBtn.on("click", getCoor);