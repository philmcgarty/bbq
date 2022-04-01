var recipeData = {};

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