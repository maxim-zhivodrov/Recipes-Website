<template>
  <div class="full_recipe">
    <div class="recipe-preview">
      <img class="center" :src="image" width="100%" >
      <ul class="right_side_props">
        <li><img src="../assets/clock_icon.png" width="60" height="60"/>   {{ readyInMinutes }} minutes</li>
        <li><img src="../assets/like_icon.png" width="60" height="60"/>{{ aggregateLikes }}</li>
        <li><img src="../assets/diners_icon.png" width="60" height="60"/>  {{ numOfDiners }}</li>
        <!-- <br> -->
        <li v-if="vegetarian"><img id="if"  src="../assets/vegetarian_icon.png" width="80" height="80"></li>
        <li v-else><img id="else" src="../assets/notVegetarian_icon.png" width="80" height="80"></li>
        <li v-if="vegan"><img id="if" src="../assets/vegan_icon.png" width="80" height="80"></li>
        <li v-else><img id="else" src="../assets/notVegan_icon.png" width="80" height="80"></li>
        <li v-if="glutenFree"><img id="if" src="../assets/glutenFree_icon.png" width="80" height="80"></li>
        <li v-else><img id="else" src="../assets/gluten_icon.png" width="80" height="80"></li>
      </ul>
      <ul class="left_side_props">
        <li v-if="!isPersonalRecipe&&inFavorites&&checkIfCookie()"><img id="if" src="../assets/full_star_icon.png" width="60" height="60"></li>
        <li @click="addToFav" @mouseover="isHovering = true" @mouseout="isHovering = false" v-else-if="!isPersonalRecipe&&checkIfCookie()&&!isHovering"><img id="else-if" src="../assets/empty_star_icon.png" width="60" height="60"></li>
        <li @click="addToFav" @mouseover="isHovering = true" @mouseout="isHovering = false" v-else-if="!isPersonalRecipe&&checkIfCookie()&&isHovering"><img id="else-if" src="../assets/hover_star_icon.png" width="60" height="60"></li>
      
        <li v-if="!isPersonalRecipe&&watched&&checkIfCookie()"><img id="if" src="../assets/seen_icon.png" width="50" height="40"></li>
        <li v-else-if="!isPersonalRecipe&&checkIfCookie()&&!watched"><img id="else-if" src="../assets/not_seen_icon.png" width="50" height="40"></li>
      </ul>
    </div>
    <h2 style=" text-align: center;"><b>{{ title }}</b></h2>
    <br>
    <div class="recipe-body">
        <div class="row">
          <div class="first_column">
            <h2 style="font-family: Comic Sans MS;"><u>Ingrediants</u></h2>
            <br>
            <ul v-for="i in ingredients" :key="i.ingredient_name">
              <li>
                <ul style="display:inline-block;" class="list-group">
                  <li class="list-group-item disabled">{{ i.ingredient_name }}, {{ i.amount }} {{ i.unit }}</li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="second_column">
            <h2 style="padding-left: 30%; font-family: Comic Sans MS;"><u>Instructions</u></h2>
            <br>
            <ol >
              <li v-for="i in instructions" :key="i.instructionNum">
                <ol  class="list-group">
                  <li class="list-group-item disabled">{{ i.instructionCont }}</li>
                </ol>
              </li>
            </ol>
          </div>
        </div>
        
        

        

      <!-- </ul> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    readyInMinutes: {
      type: Number,
      required: true
    },
    aggregateLikes: {
      type: Number,
      required: false,
      default() {
        return undefined;
      }
    },
    vegetarian: {
      type: Boolean,
      required: true
    },
    vegan: {
      type: Boolean,
      required: true
    },
    glutenFree: {
      type: Boolean,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    ingredients: {
      typr: Array,
      required: true
    },
    instructions: {
      type: Array,
      required: true
    },
    numOfDiners: {
      type: Number,
      required: true
    },
    inFavorites: {
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    },
    watched: {
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    },
    isPersonalRecipe:{
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isHovering: false
    };
  },
  methods:{
    async addToFav(){
      if(window.$cookies.isKey('session'))
      {
        let response = await this.axios.post("http://localhost:3000/users/addRecipeToFavs",
        {
            recipeID:this.$route.params.recipeId
        });
        this.recipe=response.data;
        this.inFavorites=true;
      }
        
    },
    checkIfCookie(){
        return window.$cookies.isKey('session');
    }
  }
};
</script>

<style scoped>
  .first_column {
    float: left;
    width: 40%;
    padding-left: 15%;
  }
  .second_column {
    float: left;
    width: 50%;
  }
  .row {
  display: flex;
  }
  .center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  /* width: 50%; */
  }

  .right_side_props {
    position: absolute;
    top: 2%;
    right: -150px;
    list-style-type: none; 
  }
  .left_side_props {
    position: absolute;
    top: 2%;
    left: -105px;
    list-style-type: none; 
  }

  .recipe-preview {
    width: 40%;
    border: 1px solid #ccbba5;
    position: relative;
    /* margin: 3px 3px 10px 150px; */
    transition: transform 0.2s;
    display: block;
  margin-left: auto;
  margin-right: auto;
  }


</style>
