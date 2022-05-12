var key = "cc82ba65ca932ac8748f141a8908c5f9";

var srchBtn = $("#search-bttn");
var weatherInfo = $("main");

function getCoor() {
    var city = $("#search-input").val();

    var baseURL = "https://api.openweathermap.org/data/2.5/weather";
    var call = baseURL + "?q=" + city + "&appid=" + key;

    $.ajax({url: call, success: function(response) {
        getWeather(response.coord, response.name);
    }})
}

function getWeather(coordinates, city) {
    var baseURL = "https://api.openweathermap.org/data/2.5/onecall";
    var lat = coordinates.lat;
    var lon = coordinates.lon;
    var call =  baseURL + "?lat=" + lat + "&lon=" + lon +
    "&exclude=minutely,hourly,daily,alerts&appid=" + key + "&units=imperial";
    
    // City Name
    console.log(city);

    $.ajax({url: call, success: function(response) {
        // Date
        console.log(unixDate(response.current.dt));

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

function renderCurrent(city, date) {
    var currentCard = $("<div>"); // .attr("class", "container")

    currentCard.append($("<h2>").text(city));
    currentCard.append($("<p>").text("(" + date + ")"));

    weatherInfo.append(currentCard);
}

function unixDate(timestamp) {
    var date = new Date(timestamp * 1000);
    var month = date.getMonth() + 1;
    return month + "/" + date.getDate();
}

srchBtn.on("click", getCoor);