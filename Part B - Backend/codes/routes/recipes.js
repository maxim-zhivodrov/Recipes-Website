var express = require("express");
var router = express.Router();
const axios = require("axios");
const spooncular = require("../modules/spooncular_requests");

const api_domain = "https://api.spoonacular.com/recipes";

/**
 * Search for recipes in the Spoonacular API, the number of results will be determined by the input paramenter
 */
router.get("/search/query/:userSearch/numToShow/:userNum", async (req, res, next) => {
  try {
    const { cuisine, diet, intolerances } = req.query;
    const {userSearch,userNum}=req.params;

    const search_response =await spooncular.search(userSearch,cuisine,diet,intolerances,userNum);
    let recipes = await Promise.all(
        search_response.data.results.map((recipe_raw) =>
            spooncular.recipePreviewData(recipe_raw.id)
        )
    );
    if(recipes.length>0)
      res.send(recipes);
    else
    {
      // res.status(204);
      res.status(200).send({message:"No recipes found for the inserted query"});
    }
  } catch (error) {
    next(error);
  }
});

/**
 * returns JSON Objects containing the preview info of the recipes
 */
router.get("/getThreeRandomRecipes", async (req, res, next) => {
  try{
    const random_recepies=await spooncular.random();
    res.send(random_recepies);
  }
  catch(error){
    next(error);
  }

});

/**
 * JSON Objects containing the full info of a recipe
 */
router.get("/recipePage/recipeID/:recipeID", async (req, res, next) => {
  try{
    const {recipeID}=req.params;
    let toSend=await spooncular.recipeFullData(recipeID);
    res.send(toSend);
  }
  catch(error){
    next(error);
  }

});


module.exports = router;