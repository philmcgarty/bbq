// Global Variables

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
                        if(recipeData){
                            renderRecipeList()
                        }

                        
                    })
            }
        })
}

var renderRecipeList= function(){


    recipeData.hits.forEach(item=>{
        var images=document.createElement('img');
        var li= document.createElement('li');
        var recipeName=document.createElement('p');
        var addBtn = document.createElement('button');


        addBtn.textContent= "ADD";
        addBtn.classList.add('button','is-primary');
        images.classList.add('recipe-photos');
        images.setAttribute('src',item.recipe.image);
        li.classList.add('recipe-cards');
        recipeName.textContent=item.recipe.label;
    
        li.appendChild(images);
        li.appendChild(recipeName);
        li.appendChild(addBtn);
        ul.appendChild(li);


    })
    
   

}

getRecipeData();

