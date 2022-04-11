// Global Variables
var searchRecipeInput=document.getElementById('recipe-search-input');
var searchBtn=document.getElementById('search-recipe-btn');
var addedRecipes=document.getElementById('added-Recipes');
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

// var for object weather data 
var weatherData = {};

//Global Variables
var recipeList = [];
var guestList = [];
var dateSelected = "Monday";
// New Class for holding a BBQ
console.log("Im working!");

// class bbqEvent {
//     constructor(recipes, guests, date) {
//         this.recipes = recipes;
//         this.guests = guests;
//         this.date = date;
//     }
// }

// $("#add-guest-btn").on("click", function(){
//     var name= document.getElementById("new-guest").value;
//     guestList.push(name);
//     console.log("Guest added");
//     console.log(name);
//     console.log(guestList);
// })

// $("#weather-section").on("click", function(){
//     var retrievedBBQ = localStorage.getItem(dateSelected);
//     console.log(`The bbq is:`, JSON.parse(retrievedBBQ));
//     const textForDemo = JSON.parse(retrievedBBQ);
//     document.getElementById("guestList").innerHTML = textForDemo.date + ", " + textForDemo.recipes[0];
// })

// $("#add-bbq-btn").on("click", function(){
//     thisBBQ = new bbqEvent();
//     thisBBQ.recipes = ["chicken", "beef", "taco"];
//     thisBBQ.guests = guestList;
//     thisBBQ.date = '26 Mar';
//     console.log(`The contents of the BBQ on ${thisBBQ.date} guest list are: ${thisBBQ.guests} with the recipes for: ${thisBBQ.recipes}`);
//     recipeList = "";
//     guestList = "";
//     localStorage.setItem(dateSelected, JSON.stringify(thisBBQ))
// })

function save() {
    var guests  = []
    var recipes = []

    Array.from(document.getElementById("guestlist").children).forEach(item => { 
        guests.push(item.innerHTML) 
    })
    Array.from(document.getElementById("added-Recipes").children).forEach(item => {
        recipes.push({"query": item.getAttribute("data-query"), 
                     "index": item.getAttribute("data-query-index")}) 
    })

    var dateSave = document.getElementById("bbq-date").innerHTML

    var saveObj =  {"guests": guests, "date": dateSave, "recipes": recipes}

    localStorage.setItem("saveData", JSON.stringify(saveObj))
}

function restore() {
    var saveData = JSON.parse(localStorage.getItem("saveData"))

    var bbqDateElement = document.getElementById("bbq-date");
    bbqDateElement.innerHTML = saveData.date;

    saveData.guests.forEach( g => {
        addUiData(document.getElementById("guestlist"), g);
    })

    saveData.recipes.forEach( r => {

        getRecipeData(r.query, false)
        
        var recipeI = JSON.parse(localStorage.currentRecipeQuery).hits[JSON.parse(r.index)]

        // Create Element inside the card
        var images=document.createElement('img');
        var li= document.createElement('li');
        var recipeName=document.createElement('a');

        images.setAttribute('src', recipeI.recipe.image);
        li.classList.add('columns','recipe-items');
        recipeName.classList.add('column','is-two-quaters','recipe-name')
        recipeName.setAttribute('href',recipeI.recipe.url);
        recipeName.setAttribute('target','_blank');
        // addBtn.classList.add('button','is-primary', 'recipe-add-button');
        // removeBtn.classList.add ('button','is-primary');
        // removeBtn.setAttribute('style','display:none');
        images.classList.add('column','is-one-quarter');

        li.setAttribute("data-query", recipeData.q)
        li.setAttribute("data-query-index", i)
        
        recipeName.textContent=recipeI.recipe.label;
    
        // Append to parent cards
        li.appendChild(images);
        li.appendChild(recipeName);
        addedRecipes.appendChild(li);
    })
}

function clearStorage(){
    console.log("Clearing");
    localStorage.removeItem("saveData");
}

onclick="setDateFunction('today+0' + 'today+1' + 'today+2' + 'today+3' + 'today+4')"

function setDateFunction(dayAdd) {
    bbqDate = currentDate + dayAdd;
}

// basic function to pull bbq info from the recipe API
var getRecipeData = function(searchValue, renderRecipes){
    
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

                        if(renderRecipes){
                            renderRecipeList();
                        } else {
                            localStorage.setItem("currentRecipeQuery", JSON.stringify(recipeData));
                        }
                    })
            }
        }).catch(function(){
            // switch for modal
            alert("Unable to connect to recipe data")});
};

getRecipeData("bbq", true);

var renderRecipeList= function(){

    var ul = document.getElementById('list-recipes');

    //  Run for each to get the item from API
    recipeData.hits.forEach((item, i) =>{

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
        addBtn.classList.add('button','is-primary', 'recipe-add-button');
        removeBtn.classList.add ('button','is-primary');
        removeBtn.setAttribute('style','display:none');
        images.classList.add('column','is-one-quarter');

        li.setAttribute("data-query", recipeData.q)
        li.setAttribute("data-query-index", i)
        
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

// getRecipeData("bbq");


// Add Even listener to click the button 
searchBtn.addEventListener('click',function(){  
    var searchRecipeData= searchRecipeInput.value.trim();

    // remove item if having data before render new list
    var removeLiEl=document.querySelectorAll('.recipe-items');
    if(removeLiEl){
        removeLiEl.forEach(i=>{
            i.remove()
        });
    };
        
    getRecipeData(searchRecipeData, true);
});

// // Get the modal
// var modal = document.getElementsByClassName('modal');

// // Get the button that opens the modal
// var btn = document.getElementsByClassName("myBtn");

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close");

// // When the user clicks the button, open the modal 
// btn[0].onclick = function() {
//     modal[0].style.display = "block";
// }

// btn[1].onclick = function() {
//     modal[1].style.display = "block";
// }
// // When the user clicks on <span> (x), close the modal
// span[0].onclick = function() {
//     modal[0].style.display = "none";
// }

// span[1].onclick = function() {
//     modal[1].style.display = "none";
// }
// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }

// Modal Input

// FUNCTION TO CREATE P TAG AND ADD SOME ELEMENT
var addUiData = function(element, elementData, optionalClassStyle){
    var paraElement = document.createElement("p");
    paraElement.innerHTML = elementData;
    if (optionalClassStyle)
        paraElement.setAttribute("class", optionalClassStyle);
    element.appendChild(paraElement);
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
        addUiData(dayElement, date);
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
        addUiData(dayElement, weatherDescription, "capitalize");
        // display day temp
        var dayTemp = Math.floor(weatherData.daily[i].temp.day);
        var dayTempStr = `Day: ${dayTemp}`;
        addUiData(dayElement, dayTempStr);
        // display daytime feels like temp
        var dayTempFeelsLike = Math.floor(weatherData.daily[i].feels_like.day);
        var dayFeelsStr = `Feels: ${dayTempFeelsLike}`;
        addUiData(dayElement, dayFeelsStr);
        // display evening temp
        var eveTemp = Math.floor(weatherData.daily[i].temp.eve);
        var eveTempStr = `Eve: ${eveTemp}`;
        addUiData(dayElement, eveTempStr);
        // display evening feels like temp - removed for space
        // var eveTempFeelsLike = Math.floor(weatherData.daily[i].feels_like.eve);
        // var eveFeelsStr = `Feels: ${eveTempFeelsLike}`;
        // addWeatherData(dayElement, eveFeelsStr);
        // display UVI
        var uvi = Math.floor(weatherData.daily[i].uvi);
        var uviStr = `UVI: ${uvi}`;
        addUiData(dayElement,uviStr);
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
        addUiData(dayElement, comment, "bold");
    };
}

// FUNCTION TO GET WEATHER
var getWeatherData = function(){
    // API call hardcoded to location of Ottawa for MVP
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=45.424721&lon=-75.695000&exclude=minutely,hourly,alerts&units=metric&appid=8afb55e108bfe22e6df569f88292df63"
    console.log(weatherUrl);
    fetch(weatherUrl)
        .then(function(response){
            if (response.ok){
                response.json()
                    .then(function(data){
                        weatherData = data;
                        // console.log(weatherData);
                        localStorage.setItem("dailyWeatherData", JSON.stringify(weatherData.daily))
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
    addUiData(guestlistElement, guest);
    guestsArray.push(guest);
    //console.log(guestsArray);
    document.querySelector("#new-guest").value = "";
})