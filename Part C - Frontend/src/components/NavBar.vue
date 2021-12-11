<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Babushka recipes</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>


      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item  to="/" >MainPage</b-nav-item>
          <b-nav-item to="/search" tag="a">Search</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
          
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-navbar-brand  v-if="!this.cookiebla">Hello Guest</b-navbar-brand>
          <!-- <b-navbar-brand v-else>{{this.$store.username}}</b-navbar-brand> -->
          <b-navbar-brand v-else>{{this.$localStorage.get('username')}}</b-navbar-brand>
          <b-nav-item  to="/Login" v-if="!this.cookiebla">Login</b-nav-item>
          <b-nav-item  to="/register" v-if="!this.cookiebla">Register</b-nav-item>


          <b-nav-item-dropdown  v-if="this.cookiebla" right>
            <template v-slot:button-content>
              <em>Personal</em>
            </template>
            <b-dropdown-item to="/favorites">My Favorites</b-dropdown-item>
            <b-dropdown-item to="/personal">My Recipes</b-dropdown-item>
            <b-dropdown-item to="/family">My Family Recipes</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item v-if="this.cookiebla" @click="logout" to="/">Log out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data(){
    return {
      name:"Navbar",
       username:""
    };
  },
  mounted() {
    this.updateCookie();
  },
  props:{
    cookiebla: {
      type: Boolean,
      required: true
    },
  },
  methods:{
    updateCookie(){
      this.username=this.$localStorage.get("username");
      // this.username=this.$store.username;
      // this.cookiebla=window.$cookies.isKey('session');
    },
    logout(){
      window.$cookies.remove('session');
      // this.$store.username="";
      this.$localStorage.remove('username')
      this.$store.lastSearch=[];
      this.$parent.$data.hasCookie=window.$cookies.isKey('session');
      this.$parent.$children[1].$data.hasCookie=false;
      this.$parent.$children[1].$data.recipes.forEach(recipe=>{recipe.inFavorites=!recipe.inFavorites;recipe.watched=!recipe.watched});
      this.$parent.$children[1].$data.watchedRecipes=[];
    }
  },
};
</script>

<style></style>
