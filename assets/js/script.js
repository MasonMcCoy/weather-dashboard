var key = "cc82ba65ca932ac8748f141a8908c5f9";
var baseURL = "https://api.openweathermap.org/data/2.5/weather";
var city = "Chicago";

var call = baseURL + "?q=" + city + "&appid=" + key;

function getWeather(city) {
    $.ajax({url: call, success: function(response) {
        console.log(response);
    }})
}