<template>
  <div class="main">
    <router-link  :to="{ name: 'recipe', params: { recipeId: this.id} }">
      <div class="recipe-preview">
        <div id="footer" class="recipe-footer">
          <div :title="title" class="recipe-title">{{ title }}</div>
          <ul class="recipe-overview">
            <img src="../assets/clock_icon.png" width="25" height="25"/>
            <li>{{ readyInMinutes }} minutes</li>
            <li><img src="../assets/like_icon.png" width="25" height="25"/>{{ aggregateLikes }}</li>
          </ul>
        </div>
        <img style="position: absolute; top: 0px; right: 0px;" id="if" v-if="inFavorites&&checkIfCookie()"
             src="../assets/full_star_icon.png" width="45" height="45">
        <img style="position: absolute; top: 0px; right: 0px;" id="else-if" v-else-if="!inFavorites&&checkIfCookie()"
             src="../assets/empty_star_icon.png" width="45" height="45">

        <img style="position: absolute; top: 50px; right: 0px;" id="if" v-if="watched&&checkIfCookie()"
             src="../assets/seen_icon.png" width="40" height="30">
        <img style="position: absolute; top: 50px; right: 0px;" id="else-if" v-else-if="!watched&&checkIfCookie()"
             src="../assets/not_seen_icon.png" width="40" height="30">

        <img style="position: absolute; bottom: 8px; left: -85px;" id="if" v-if="vegetarian"
             src="../assets/vegetarian_icon.png" width="80" height="80">
        <img style="position: absolute; bottom: 8px; left: -85px;" id="else" v-else
             src="../assets/notVegetarian_icon.png" width="80" height="80">
        <img style="position: absolute; bottom: 82px; left: -85px;" id="if" v-if="vegan" src="../assets/vegan_icon.png"
             width="80" height="80">
        <img style="position: absolute; bottom: 82px; left: -85px;" id="else" v-else src="../assets/notVegan_icon.png"
             width="80" height="80">
        <img style="position: absolute; bottom: 160px; left: -85px;" id="if" v-if="glutenFree"
             src="../assets/glutenFree_icon.png" width="80" height="80">
        <img style="position: absolute; bottom: 160px; left: -85px;" id="else" v-else src="../assets/gluten_icon.png"
             width="80" height="80">
        <img class="image" :src="image" width="500" height="250" style="border-radius: 25px;">
      </div>
    </router-link>
     

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
    watched: {
      type: Boolean,
      required: false,
      default() {
        return undefined;
      }
    },
    inFavorites: {
      type: Boolean,
      required: false,
      default() {
        return undefined;
      }
    },
    width:{
      type: Number,
      required: false,
      default() {
        return 500;
      } 
    },
    height:{
      type: Number,
      required: false,
      default() {
        return 250;
      } 
    }
  },
  methods:{
    checkIfCookie(){
      if(this.$parent.$data.name==="PersonalRecipesPage")
        return false;
      else
        return window.$cookies.isKey('session');
    }
  }
};
</script>

<style scoped>
.main{
  padding-left: 6%;
}

.recipe-preview {
  width: 500px;
  /* border: 1px solid #ccbba5; */
  position: relative;
  margin: 3px 3px 10px 10px;
  transition: transform 0.2s;
}

.recipe-preview:hover {
  transform: scale(1.2);
  z-index: 10;
}

.recipe-footer {
  position: absolute;
  bottom: 0px;
  border-radius: 0px 0px 0px 25px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
}

.recipe-title {
  padding: 5px 5px;
  font-weight: bold;
  font-family: "Comic Sans MS", cursive, sans-serif;
  width: 100%;
  font-size: 12pt;
  text-align: left;
}

.recipe-overview {
  padding: 0px 10px;
  display: flex;
}

.recipe-preview .recipe-footer ul.recipe-overview li {
  display: table-cell;
  margin-left: 10px;
}

.icon{
  position: absolute; top: 8px; right: 16px;
}
.image {
  transition: transform 0.2s;
}

</style>
