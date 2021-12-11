const axios = require("axios");

const api_domain = "https://api.spoonacular.com/recipes";

async function search(userSearch,cuisine,diet,intolerances,userNum)
{
    const search_response = await axios.get(`${api_domain}/search`, {
        params: {
          query: userSearch,
          cuisine: cuisine,
          diet: diet,
          intolerances: intolerances,
          number: userNum,
          instructionsRequired: true,
          apiKey: process.env.spooncular_apiKey
        }
      });
      return search_response;
}

async function random()
{
    const random_recepies = await axios.get(`${api_domain}/random`, {
        params: {
          number: 3,
          apiKey: process.env.spooncular_apiKey
        }
      });
    return random_recepies.data.recipes.map((recipe)=>{
        const {
            id,title,readyInMinutes,aggregateLikes,vegetarian,vegan,glutenFree,image
        } = recipe;
        return {
            id:id,
            title:title,
            readyInMinutes:readyInMinutes,
            aggregateLikes:aggregateLikes,
            vegetarian:vegetarian,
            vegan:vegan,
            glutenFree:glutenFree,
            image:image
        };
    });
}

async function information(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
      params: {
        includeNutrition: false,
        apiKey: process.env.spooncular_apiKey
      }
    });
}

async function recipePreviewData(recipe_id)
{
  recipe=await axios.get(`${api_domain}/${recipe_id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  });

  const{id,title,readyInMinutes,aggregateLikes,vegetarian,vegan,glutenFree,image} = recipe.data;

  return {
    id:id,
    title:title,
    readyInMinutes:readyInMinutes,
    aggregateLikes:aggregateLikes,
    vegetarian:vegetarian,
    vegan:vegan,
    glutenFree:glutenFree,
    image:image,
  };

}

async function recipeFullData(recipe_id)
{
  recipe=await axios.get(`${api_domain}/${recipe_id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  });

  const{id,title,readyInMinutes,aggregateLikes,vegetarian,vegan,glutenFree,image,extendedIngredients,analyzedInstructions,servings} = recipe.data;
  var ourIngredients=[];
  extendedIngredients.forEach(ingr => {
    const{name,amount,unit} = ingr;
    ourIngredients.push({ingredient_name:name,unit:unit,amount:amount});
  });
  var ourInstructions=[];
  analyzedInstructions[0].steps.forEach(inst => {
    const{number,step} = inst;
    ourInstructions.push({instructionNum:number,instructionCont:step});
  });
  return {
    previewItems:{
      id:id,
      title:title,
      readyInMinutes:readyInMinutes,
      aggregateLikes:aggregateLikes,
      vegetarian:vegetarian,
      vegan:vegan,
      glutenFree:glutenFree,
      image:image
    },
    ingredients:ourIngredients,
    instructions:ourInstructions,
    numOfDiners:servings
    
  };

}
exports.search=search;
exports.random=random;
exports.information=information;
exports.recipePreviewData=recipePreviewData;
exports.recipeFullData=recipeFullData;