var express = require("express");
var router = express.Router();
const DButils = require("../modules/DButils");
const spooncular = require("../modules/spooncular_requests");

/**
 * check if user is logged in
 */
router.use(function requireLogin(req, res, next) {
  if (!req.session.username) {
    next({ status: 401, message: "unauthorized" });
  } else {
    next();
  }
});

/**
 * returns JSON objects containing the info about the user's family recipes
 */
router.get("/familyRecipes", async (req,res)=>{
  let familyRecipes=await DButils.execQuery(`select * from familyRecipes where username='${req.username}'`);
  let toSend=new Array();

  await Promise.all(
      familyRecipes.map(async(recipe)=>{
        let ingredients=await DButils.execQuery(`select ingredient_name,amount,unit from familyRecipesIngredients where recipe_id='${recipe.recipe_id}'`);
        let ingredientArr=new Array();
        ingredients.forEach(ingredient=>{
          ingredientArr.push({ingredient_name:ingredient.ingredient_name,unit:ingredient.unit,amount:ingredient.amount});
        });

        let instructionsArr=new Array();
        let instructionsAfterSplit=recipe.instructions.replace("<ol>","").replace("</ol>","");
        instructionsAfterSplit=instructionsAfterSplit.split("</li>").join("").split("<li>");
        let counter=0;
        instructionsAfterSplit.forEach(instruction=>{
          if(instruction.length>1){
            instructionsArr.push({instructionNum:++counter,instructionCont:instruction})
          }
        });

        toSend.push({id:recipe.recipe_id,title:recipe.title,image:recipe.image,familyMember:recipe.familyMember,
                        specialOccasion:recipe.specialOccasion,ingredients:ingredientArr,instructions:instructionsArr});
      })
  );
  res.status(200).send(toSend);
})

/**
 * returns the user info about the input recipes
 */
router.get("/userRecipeInfo/:recipeIDs", async (req,res)=>{
  const ids=req.params.recipeIDs;
  const username=req.username;
  const infos = await DButils.execQuery(`SELECT recipeID,watched,inFavorites FROM recipeUserInfo where username='${username}'`);
  res.send(getUserRecipeData(infos,ids));
});

/**
 * returns JSON objects containing the preview info about the user's favorite recipes
 */
router.get("/favorites", async function (req, res) {
  try
  { 
    const username=req.username;
    let toSend=[];
    const favorite_ids = await DButils.execQuery(`SELECT recipeID FROM recipeUserInfo where username='${username}' and inFavorites=1`);
    for (const id of favorite_ids) {
      let recipe=await spooncular.recipePreviewData(id.recipeID);
      toSend.push(recipe);
    }
  
    res.send(toSend);
  } catch (error) {
    next(error);
  }
  
});

/**
 * adds a recipe to the logged in user's favorited
 */
router.post("/addRecipeToFavs", async (req, res, next) => {
  try {
    let query="";
    const username=req.username;
    const alreadyExists = await DButils.execQuery(`SELECT inFavorites FROM recipeUserInfo where recipeID='${req.body.recipeID}' and username='${username}'`);
    if(alreadyExists.length==0)
    {
      query=`insert into recipeUserInfo (username,recipeID,inFavorites,watched) VALUES('${username}','${req.body.recipeID}',1,0)`;
    }
    else
      query=`UPDATE recipeUserInfo set inFavorites='1' where recipeID='${req.body.recipeID}' and username='${username}'`;
    if(alreadyExists.length!=0 && alreadyExists[0].inFavorites==1)
      throw { status: 409, message: "The recipe already in favorites!" };
    else
      await DButils.execQuery(query);

    res.status(201).send({ message: "The recipe has been added to favorites!"});
  } catch (error) {
    next(error);
  }
});

/**
 * returns JSON objects containing the preview info about the user's personal recipes
 */
router.get("/personalRecipes", async function (req, res) {
  try {
    const username=req.username;
    const personal_recipes = await DButils.execQuery(`SELECT recipe_id,title,image,makingTime,likes,vegetarian,vegan,glutenFree FROM recipes where username='${username}'`);
  
    let toSend=[];
    personal_recipes.forEach(recipe => {
      toSend.push({
        id:recipe.recipe_id,
        title:recipe.title,
        readyInMinutes:recipe.makingTime,
        aggregateLikes:recipe.likes,
        vegetarian:recipe.vegetarian,
        vegan:recipe.vegan,
        glutenFree:recipe.glutenFree,
        image:recipe.image
      });
    });
    
    res.send(toSend);
  }
  catch (error) {
    next(error);
  }
  
});

/**
 * marks the time in which the user watched a recipe
 */
router.post("/watchRecipe", async (req, res, next) => {
  try {
    let query="";
    const username=req.username;
    const currDate=new Date();
    const currTime=currDate.getTime()+"";
    const alreadyExists = await DButils.execQuery(`SELECT watched FROM recipeUserInfo where recipeID='${req.body.recipeID}' and username='${username}'`);
    if(alreadyExists.length==0)
    {
      query=`insert into recipeUserInfo (username,recipeID,inFavorites,watched,timeWatched) VALUES('${username}','${req.body.recipeID}',0,1,'${currTime}')`;
    }
    else
      query=`UPDATE recipeUserInfo set watched='1', timeWatched='${currTime}' where recipeID='${req.body.recipeID}' and username='${username}'`;
    
    await DButils.execQuery(query);

    res.status(201).send({ message: "watch attribute updated!"});
  } catch (error) {
    next(error);
  }
});

/**
 * returns JSON objects containing the preview info about the last 3 recipes the user watched
 */
router.get("/lastWatchedRecipes", async function (req, res) {
  try {
    const username=req.username;
    let ids=[];
    let toSend=[];
    let watched=[];
    const watched_DB = await DButils.execQuery(`SELECT recipeID,timeWatched FROM recipeUserInfo where watched=1 and username='${username}'`);
    watched_DB.forEach(recipe => {
      watched.push({id:recipe.recipeID,date:recipe.timeWatched});
    });
    const sortedDates=watched.sort((a, b) => b.date - a.date)

    let i=0;
    while(i<sortedDates.length && ids.length<3)
    {
      ids.push(sortedDates[i].id);
      i=i+1;
    }
    if(ids.length>0)
    {
      for (const id of ids) {
        let recipe=await spooncular.recipePreviewData(id);
        toSend.push(recipe);
      }
      res.send(toSend);
    }
    else 
    {
      res.send({status:400, Message: "No watched recipes for the user"});
    }
  }
  catch (error) {
    // next(error);
  }
  
});

/**
 * adds a new personal recipe to the user
 */
router.post("/addPersonalRecipe", async (req, res, next) => {
  try {
    let ifExists=await DButils.execQuery(`select * from recipes where username='${req.username}' and title='${req.body.previewItems.title}'`);
    if (ifExists.length==0) {
      await DButils.execQuery(
          `INSERT INTO recipes (recipe_id,username,title,image,makingTime,likes,vegetarian,vegan,glutenFree,instructions,numOfDiners)
                  VALUES (default,
                  '${req.username}',
                  '${req.body.previewItems.title}',
                  '${req.body.previewItems.image}',
                  '${req.body.previewItems.makingTime}',
                  '0',
                  '${req.body.previewItems.vegetarian}',
                  '${req.body.previewItems.vegan}',
                  '${req.body.previewItems.glutenFree}',
                  '${req.body.instructions}',
                  '${req.body.numOfDiners}')`
      );
      let recipeID = await DButils.execQuery(`SELECT recipe_id from recipes where title='${req.body.previewItems.title}'`);
      await Promise.all(
          req.body.ingredients.map(async (ingredient) => {
            return DButils.execQuery(`insert into recipeIngredients values('${recipeID[0].recipe_id}','${ingredient.ingredient_name}','${ingredient.amount}','${ingredient.unit}')`);
          })
      );
      res.send({status: 201, Message: "The recipe has been created"});
    }
    else {
      res.send({status:409, Message: "Recipe already exists"});
    }

  } catch (error) {
    next(error);
  }
});

/**
 * returns a JSON object containing the full info about a personal recipe
 */
router.get("/personalRecipePage/recipeID/:recipeID", async (req, res, next) => {
  const {recipeID}=req.params;

  let recipes=await DButils.execQuery(`select * from recipes where recipe_id='${recipeID}'`);
  if (recipes.length>0) {
    let toSend = new Array();

    await Promise.all(
        recipes.map(async (recipe) => {
          let ingredients = await DButils.execQuery(`select ingredient_name,amount,unit from recipeIngredients where recipe_id='${recipe.recipe_id}'`);
          let ingredientArr = new Array();
          ingredients.forEach(ingredient => {
            ingredientArr.push({
              ingredient_name: ingredient.ingredient_name,
              unit: ingredient.unit,
              amount: ingredient.amount
            });
          });
          let instructionsArr=new Array();
          let instructionsAfterSplit=recipe.instructions.replace("<ol>","").replace("</ol>","");
          instructionsAfterSplit=instructionsAfterSplit.split("</li>").join("").split("<li>");
          let counter=0;
          instructionsAfterSplit.forEach(instruction=>{
            if(instruction.length>1){
              instructionsArr.push({instructionNum:++counter,instructionCont:instruction})
            }
          });
          toSend.push({
            previewItems:{
              id: recipe.recipe_id,
              title: recipe.title,
              readyInMinutes: recipe.makingTime,
              aggregateLikes: recipe.likes,
              vegetarian: recipe.vegetarian,
              vegan: recipe.vegan,
              glutenFree: recipe.glutenFree,
              image: recipe.image,
            },
            ingredients: ingredientArr,
            instructions: instructionsArr,
            numOfDiners: recipe.numOfDiners
          });
        })
    );
    res.status(200).send(toSend);
  } else {
    res.status(400).send({message:"bad request"});
  }


});

/**
 * returns the fovorite and wathed attributes of the user's history
 * @param {*} infos 
 * @param {*} ids 
 */
function getUserRecipeData(infos,ids)
{
  let usedIDs=[];
  var idsArr=ids.replace("[","").replace("]","").split(",");

  let returnArr={};

  for(let i=0;i<idsArr.length;i++){
    for(let j=0;j<infos.length;j++){
      if(infos[j].recipeID==idsArr[i]){
        let arr=new Object();
        returnArr[infos[j].recipeID]={watched:infos[j].watched,inFavorites:infos[j].inFavorites};
        // returnArr.push(arr);
        usedIDs.push(infos[j].recipeID);
      }
    }
  }

  idsArr.forEach(id => {
    if(!usedIDs.includes(id))
    {
        let arr=new Object();
        returnArr[id]={watched:false,inFavorites:false};
        // returnArr.push({id:{watched:false,inFavorites:false}})
        // returnArr.push(arr);
    }
  });


  return returnArr;
}

module.exports = router;