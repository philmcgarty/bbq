// Global Variables
var searchRecipeInput=document.getElementById('recipe-search-input');
var searchBtn=document.getElementById('search-recipe-btn');
var addedRecipes=document.getElementById('addedRecipes');

// for saving all info to local storage
var formInfoArray = [];
// for saving date of bbq to local storage
var bbqDate = ""
// for storing guests added to guestlist
var guestsArray = [];
// for storing recipes selected by the user
var recipesArray =[];

// var for recipes that have been pulled from the API
var recipeData = {};

var ul= document.getElementById ('list-recipes');





// basic function to pull bbq info from the recipe API
var getRecipeData = function(searchValue){
    
    var tastyUrl = "https://api.edamam.com/search?q="+searchValue+"&app_id=800e3765&app_key=fe74dbedc36e502afaf6d444ca0f100e";


    console.log(tastyUrl);
    fetch(tastyUrl)
        .then(function(response){
            if (response.ok){
                response.json()
                    .then(function(data){
                        recipeData = data;
                        console.log(recipeData);
                        // Calling function showing recipe list


                        if(recipeData){
                            renderRecipeList();
                             

                        }
                    })
            }
        }).catch(function(){
            // switch for modal
            alert("Unable to connect to recipe data")});
};


getRecipeData("bbq");



var renderRecipeList= function(){

    //  Run for each to get the item from API

    recipeData.hits.forEach(item=>{

        // Create Element inside the card
        var images=document.createElement('img');
        var li= document.createElement('li');
        var recipeName=document.createElement('a');
        var addBtn = document.createElement('button');

        var removeBtn=document.createElement('button');

        // Add attribute and class for styling
        removeBtn.textContent="Remove";
        addBtn.textContent= "Add";

        images.setAttribute('src',item.recipe.image);
        li.classList.add('columns','recipe-items');
        recipeName.classList.add('column','is-two-quaters','recipe-name')
        recipeName.setAttribute('href',item.recipe.url);
        recipeName.setAttribute('target','_blank');
        addBtn.classList.add('button','is-primary');

        removeBtn.classList.add ('button','is-primary');
        removeBtn.setAttribute('style','display:none');

        images.classList.add('column','is-one-quarter');

        recipeName.textContent=item.recipe.label;
    
        // Append to parent cards

        
        li.appendChild(images);
        li.appendChild(recipeName);
        li.appendChild(addBtn);
        li.appendChild(removeBtn)

        ul.appendChild(li);
        

        // Add click to remove the parent container

        addBtn.addEventListener('click',function(event){
            
            // Remove li
            event.target.parentNode.remove();
            // Add to bbq information
            addedRecipes.appendChild(event.target.parentNode);

            // Replace add button by remove button
            event.target.style.display= "none";
            event.target.nextElementSibling.style.display="block";


        });
        // Add click event for remove button
        removeBtn.addEventListener('click',function(e){
            e.target.parentNode.remove();

        })

        


    });
    
   

};

getRecipeData("bbq");


// Add Even listener to click the button 
searchBtn.addEventListener('click',function(){
       
    var searchRecipeData= searchRecipeInput.value.trim();

     // remove item if having data before render new list

    var removeLiEl=document.querySelectorAll('.recipe-items');
    if(removeLiEl){
    removeLiEl.forEach(i=>{
        i.remove()

    } );
};      
        getRecipeData(searchRecipeData);

});


// Get the modal
var modal = document.getElementsByClassName('modal');

// Get the button that opens the modal
var btn = document.getElementsByClassName("myBtn");


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close");

// When the user clicks the button, open the modal 
btn[0].onclick = function() {
    modal[0].style.display = "block";
}

btn[1].onclick = function() {
    modal[1].style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span[0].onclick = function() {
    modal[0].style.display = "none";
}

span[1].onclick = function() {
    modal[1].style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// FUNCTION TO CREATE P TAG AND ADD WEATHER ELEMENT
var addWeatherData = function(dayElement, weatherDataType, classStyle){
    var paraElement = document.createElement("p");
    paraElement.innerHTML = weatherDataType;
    paraElement.setAttribute("class", classStyle);
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
        // var para = document.createElement("p");
        // para.setAttribute("class", "capitalize");
        // para.innerHTML = weatherDescription;
        // dayElement.appendChild(para);
        addWeatherData(dayElement, weatherDescription, "capitalize");
        // display day temp
        var dayTemp = Math.floor(weatherData.daily[i].temp.day);
        var dayTempStr = `Day: ${dayTemp}`;
        addWeatherData(dayElement, dayTempStr);
        // display daytime feels like temp
        var dayTempFeelsLike = Math.floor(weatherData.daily[i].feels_like.day);
        var dayFeelsStr = `Feels: ${dayTempFeelsLike}`;
        addWeatherData(dayElement, dayFeelsStr);
        // display evening temp
        var eveTemp = Math.floor(weatherData.daily[i].temp.eve);
        var eveTempStr = `Eve: ${eveTemp}`;
        addWeatherData(dayElement, eveTempStr);
        // display evening feels like temp - removed for space
        // var eveTempFeelsLike = Math.floor(weatherData.daily[i].feels_like.eve);
        // var eveFeelsStr = `Feels: ${eveTempFeelsLike}`;
        // addWeatherData(dayElement, eveFeelsStr);
        // display UVI
        var uvi = Math.floor(weatherData.daily[i].uvi);
        var uviStr = `UVI: ${uvi}`;
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
            dayElement.classList.add("cold");
        };
        addWeatherData(dayElement, comment, "bold");
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

};

