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
        // display date
        var date = ""
        if (i===0){
            date = moment().format('MMMM Do YYYY');
            
        } else {
            date = moment().add(i, 'days').format('MMMM Do YYYY');
        }
        addWeatherData(dayElement, date);
        // set data element to be used for when clicked
        dayElement.setAttribute("data-date", date);

        // display icon
        var weatherIcon = "http://openweathermap.org/img/wn/"+weatherData.daily[i].weather[0].icon+"@2x.png";
        var weatherIconDisplay = document.createElement("img");
        weatherIconDisplay.setAttribute("src", weatherIcon);
        dayElement.appendChild(weatherIconDisplay);
        // display description
        var weatherDescription = weatherData.daily[i].weather[0].description;
        addWeatherData(dayElement, weatherDescription);
        // display day temp
        var dayTemp = Math.floor(weatherData.daily[i].temp.day);
        var dayTempStr = `Day Temp: ${dayTemp} °C`;
        addWeatherData(dayElement, dayTempStr);
        // display daytime feels like temp
        var dayTempFeelsLike = Math.floor(weatherData.daily[i].feels_like.day);
        var dayFeelsStr = `Feels Like: ${dayTempFeelsLike} °C`;
        addWeatherData(dayElement, dayFeelsStr);
        // display evening temp
        var eveTemp = Math.floor(weatherData.daily[i].temp.eve);
        var eveTempStr = `Eve Temp: ${eveTemp} °C`;
        addWeatherData(dayElement, eveTempStr);
        // display evening feels like temp
        var eveTempFeelsLike = Math.floor(weatherData.daily[i].feels_like.eve);
        var eveFeelsStr = `Feels Like: ${eveTempFeelsLike} °C`;
        addWeatherData(dayElement, eveFeelsStr);
        // display UVI
        var uvi = Math.floor(weatherData.daily[i].uvi);
        var uviStr = `UV Index: ${uvi}`;
        addWeatherData(dayElement,uviStr);
        // var for displaying weather analysis
        var comment = ""
        // conditional statement to generate comment and bg colouring
        if (dayTemp>=20 && weatherData.daily[i].weather[0].id>=800){
            comment = "Perfect, fire up the BBQ!";
            dayElement.classList.add("good");
        } else if (dayTemp>=15 && weatherData.daily[i].weather[0].id>=800) {
            comment = "Good conditions";
            dayElement.classList.add("moderate");
        } else if (dayTemp<15) {
            comment = "Brrr a bit chilly!";
            dayElement.classList.add("cold");
        } else {
            comment = "Maybe not today!"
        };
        addWeatherData(dayElement, comment);
    };
}


// FUNCTION TO GET WEATHER
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
        .catch(function(){
            // switch for modal
            alert("Unable to connect to weather data");
        });
};


getWeatherData();
//getRecipeData();


// EVENT LISTENER FOR CLICKING ON DATE SECTION
$("#weather-section").on("click", ".day", function(){
    var clickedDate = $(this);
    //console.log(clickedDate);
    bbqDate = $(clickedDate).data("date");
    //console.log(bbqDate);
    var bbqDateElement = document.getElementById("bbq-date");
    bbqDateElement.innerHTML = bbqDate;
})


// EVENT LISTENER FOR "ADD GUEST" BUTTON
$("#add-guest-btn").on("click", function(){
    var guest = document.querySelector("#new-guest").value.trim();
    //console.log(guest);
    var guestlistElement = document.getElementById("guestlist");
    addWeatherData(guestlistElement,guest);
    guestsArray.push(guest);
    //console.log(guestsArray);
    document.querySelector("#new-guest").value = "";
})

// TO COLLAPSE SECTIONS
// Copied from - https://www.w3schools.com/howto/howto_js_collapsible.asp
var coll = document.getElementsByClassName("collapsible");
for (var i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}