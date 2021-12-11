<template>
  <div id="app" style="background-size: cover;background-image: url(https://foodservice.potatorolls.com/wp-content/uploads/2017/08/mission-background-image.png)">
  <!-- <div id="app" style="background-size: cover;background-repeat: no-repeat;background-image: url(https://i.pinimg.com/originals/ec/c7/a4/ecc7a4f021aab13bf5197543d291adf7.jpg)"> -->
    <NavBar :cookiebla=hasCookie />
    <router-view />
  </div>
</template>

<script>
import NavBar from "./components/NavBar";
export default {
  name: "App",
  components: {
    NavBar
  },
  data(){
    return{
      hasCookie: false
    }
  },
  mounted(){
    this.checkCookieAfterRefresh();
  },
  methods:{
    onChildClick(value){
      this.hasCookie=value;
    },
    checkCookieAfterRefresh(){
      this.hasCookie=window.$cookies.isKey('session');
    }
  }
};
</script>

<style lang="scss">
// @import "@/scss/form-style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
