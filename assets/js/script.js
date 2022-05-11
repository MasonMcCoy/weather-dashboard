var key = "cc82ba65ca932ac8748f141a8908c5f9";

var srchBtn = $("#search-bttn");

function getCoor() {
    var city = $("#search-input").val();

    var baseURL = "https://api.openweathermap.org/data/2.5/weather";
    var call = baseURL + "?q=" + city + "&appid=" + key + "&units=imperial";

    $.ajax({url: call, success: function(response) {
        // City Name
        console.log(response.name);

        // Date
        console.log(response.dt);

        getWeather(response.coord);
    }})
}

function getWeather(coordinates) {
    var baseURL = "https://api.openweathermap.org/data/2.5/onecall";
    var lat = coordinates.lat;
    var lon = coordinates.lon;
    var call =  baseURL + "?lat=" + lat + "&lon=" + lon +
    "&exclude=minutely,hourly,daily,alerts&appid=" + key;

    $.ajax({url: call, success: function(response) {
        // Weather Icon
        console.log(response.current.weather[0].icon);

        // Temperature
        console.log(response.current.temp);
        
        // Humidity
        console.log(response.current.humidity);
        
        // Wind Speed
        console.log(response.current.wind_speed);
        
        // UV Index
        console.log(response.current.uvi);
    }})

}

srchBtn.on("click", getCoor);