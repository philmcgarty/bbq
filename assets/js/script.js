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

getRecipeData();