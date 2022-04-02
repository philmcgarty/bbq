// Global Variables

// for saving all info to local storage
var formInfoArray = [];
// for saving date of bbq to local storage
var bbqDate = ""
// for storing guests added to guestlist
var guestsArray = [];
// for storing recipes selected by the user
var recipesArray = [];

// var for recipes that have been pulled from the API
var recipeData = {};

// for storing data pulled from weather API
// var weatherData = {};


// basic function to pull bbq info from the recipe API
var getRecipeData = function(){
    
    var tastyUrl = "https://api.edamam.com/search?q=bbq&app_id=800e3765&app_key=fe74dbedc36e502afaf6d444ca0f100e";
    console.log(tastyUrl);
    fetch(tastyUrl)
        .then(function(response){
            if (response.ok){
                response.json()
                    .then(function(data){
                        recipeData = data;
                        console.log(recipeData);
                    })
            }
        })
}

// FUNCTION TO CREATE P TAG AND ADD WEATHER ELEMENT
var addWeatherData = function(dayElement, weatherDataType){
    var paraElement = document.createElement("p");
    paraElement.innerHTML = weatherDataType;
    dayElement.appendChild(paraElement);
}



// FUNCTION TO ASSIGN RELEVANT WEATHER INFO FROM PULLED DATA
var useWeatherData = function(weatherData){
    // loop to display next 5 days weather info
    for (var i=0;i<5;i++){
        var dayElement = document.getElementById("today+"+i);
        var date = ""
        if (i===0){
            date = moment().format('MMMM Do YYYY');
            
        } else {
            date = moment().add(i, 'days').format('MMMM Do YYYY');
        }
        addWeatherData(dayElement, date);

        var weatherIcon = "http://openweathermap.org/img/wn/"+weatherData.daily[i].weather[0].icon+"@2x.png";
        var weatherIconDisplay = document.createElement("img");
        weatherIconDisplay.setAttribute("src", weatherIcon);
        dayElement.appendChild(weatherIconDisplay);
        
        var weatherDescription = weatherData.daily[i].weather[0].description;
        addWeatherData(dayElement, weatherDescription);
        
        var dayTemp = Math.floor(weatherData.daily[i].temp.day);
        var dayTempStr = `Day Temp: ${dayTemp} °C`;
        addWeatherData(dayElement, dayTempStr);
        
        var dayTempFeelsLike = Math.floor(weatherData.daily[i].feels_like.day);
        var dayFeelsStr = `Feels Like: ${dayTempFeelsLike} °C`;
        addWeatherData(dayElement, dayFeelsStr);

        var eveTemp = Math.floor(weatherData.daily[i].temp.eve);
        var eveTempStr = `Eve Temp: ${eveTemp} °C`;
        addWeatherData(dayElement, eveTempStr);

        var eveTempFeelsLike = Math.floor(weatherData.daily[i].feels_like.eve);
        var eveFeelsStr = `Feels Like: ${eveTempFeelsLike} °C`;
        addWeatherData(dayElement, eveFeelsStr);
        
        var uvi = Math.floor(weatherData.daily[i].uvi);
        var uviStr = `UV Index: ${uvi}`;
        addWeatherData(dayElement,uviStr);
        
    };

}


// function to get weather
var getWeatherData = function(){
    var weatherData = {};
    // API call hardcoded to location of Ottawa for MVP
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=45.424721&lon=-75.695000&exclude=minutely,hourly,alerts&units=metric&appid=8afb55e108bfe22e6df569f88292df63"
    console.log(weatherUrl);
    fetch(weatherUrl)
        .then(function(response){
            if (response.ok){
                response.json()
                    .then(function(data){
                        weatherData = data;
                        console.log(weatherData);
                        useWeatherData(weatherData);
                    })
            }
        })
}



getWeatherData();


// getRecipeData();