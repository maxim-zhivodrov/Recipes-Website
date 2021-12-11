<template>
  <div >
    <div class="column">
      <div >
        <h2 style="display: inline-block;padding-left:15%;padding-right:5%; font-family: Comic Sans MS;"><u>Explore those recipes</u></h2>
        <button style="display: inline-block;" @click="updateRecipes">Refresh</button>
      </div>
      <br>
      <div v-if="randomLoaded">
        <RecipePreview 
        v-for="r in recipes"
        :id="r.id"
        :title="r.title"
        :ready-in-minutes="r.readyInMinutes"
        :image="r.image"
        :aggregate-likes="r.aggregateLikes"
        :vegetarian="r.vegetarian"
        :vegan="r.vegan"
        :gluten-free="r.glutenFree"
        :in-favorites="r.inFavorites"
        :watched="r.watched"
        :key="r.id"
        />
      </div>
      <img v-else src="../assets/35.gif" style="position: absolute; left:15%;top:30%">
      

    </div>
    <div class="column">
      <Login @clicked="getLastWatched" v-if="!hasCookie" style="position: absolute; top: 30%;" />
      <div v-else >
        <h2 style="padding-left:20%; font-family: Comic Sans MS;"><u>Last watched recipes</u></h2><br>
        <div v-if="lastWatchedLoaded">
          <RecipePreview v-for="r in watchedRecipes"
            :id="r.id"
            :title="r.title"
            :ready-in-minutes="r.readyInMinutes"
            :image="r.image"
            :aggregate-likes="r.aggregateLikes"
            :vegetarian="r.vegetarian"
            :vegan="r.vegan"
            :gluten-free="r.glutenFree"
            :inFavorites="r.inFavorites"
            :watched="r.watched"
            :key="r.id" />
        </div>
        <img v-else src="../assets/35.gif" style="position: relative; left:40%; top:120px">

      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies';

export default {
  components: {},
  data() {
    return {
      name:"MainPage",
      recipes: [],
      recipeChosen: {},
      hasCookie:false,
      watchedRecipes: [],
      randomLoaded: false,
      lastWatchedLoaded: false
    };
  },
  mounted() {
    this.updateRecipes();
    this.checkCookieAfterRefresh();
    this.getLastWatched(true);
  },
  methods: {
    async updateRecipes() {
      this.randomLoaded=false;
      let response;
      try {
        this.axios.defaults.withCredentials = true;

        response = await this.axios.get("http://localhost:3000/recipes/getThreeRandomRecipes");

        this.recipes = [];
        if(window.$cookies.isKey('session'))
        {
          let ids = "[";
          response.data.forEach(recipe => {
            ids = ids + recipe.id + ",";
          });
          ids = ids.substring(0, ids.length - 1) + "]";
          const infos = await this.axios.get(
            "http://localhost:3000/users/userRecipeInfo/" + ids
          );
          response.data.forEach(recipe => {
            for (const [key, value] of Object.entries(infos.data)) {
              if (recipe.id == key) {
                recipe.watched = value.watched;
                recipe.inFavorites = value.inFavorites;
              }
            }
          });
        }
        this.recipes.push(...response.data);
        this.randomLoaded=true;
      } catch (error) {
        this.recipes.push(...response.data);
      }
    },
    async getLastWatched(value){
      try{
          this.lastWatchedLoaded=false;
          this.updateCurrentRandoms();
          this.axios.defaults.withCredentials = true;
          let response = await this.axios.get("http://localhost:3000/users/lastWatchedRecipes");
    
          this.watchedRecipes = [];
          if(window.$cookies.isKey('session'))
          {
            let ids = "[";
            response.data.forEach(recipe => {
              ids = ids + recipe.id + ",";
            });
            ids = ids.substring(0, ids.length - 1) + "]";
            const infos = await this.axios.get(
              "http://localhost:3000/users/userRecipeInfo/" + ids
            );
            response.data.forEach(recipe => {
              for (const [key, value] of Object.entries(infos.data)) {
                if (recipe.id == key) {
                  recipe.watched = value.watched;
                  recipe.inFavorites = value.inFavorites;
                }
              }
            });
          }
    
          this.watchedRecipes.push(...response.data);
          this.lastWatchedLoaded=true;
      }
      catch(erroe)
      {
        this.watchedRecipes=[];
        this.lastWatchedLoaded=true;

      }
    },
    checkCookieAfterRefresh(){
      this.hasCookie=window.$cookies.isKey('session');

    },
    async updateCurrentRandoms(){
      let response;
      try {
        this.axios.defaults.withCredentials = true;
        if(window.$cookies.isKey('session'))
        {
          let ids = "[";
          this.recipes.forEach(recipe => {
            ids = ids + recipe.id + ",";
          });
          ids = ids.substring(0, ids.length - 1) + "]";
          const infos = await this.axios.get(
                  "http://localhost:3000/users/userRecipeInfo/" + ids
          );
          this.recipes.forEach(recipe => {
            for (const [key, value] of Object.entries(infos.data)) {
              if (recipe.id == key) {
                recipe.watched = value.watched;
                recipe.inFavorites = value.inFavorites;
              }
            }
          });
        }
      }
      catch (error) { let n=0;}
    },

  }
};
</script>

<style scoped>
.column {
  float: left;
  width: 50%;
  padding: 10px;
  padding-left: 5%;
}

* {
  box-sizing: border-box;
}

.row {
  display: flex;
}
</style>
