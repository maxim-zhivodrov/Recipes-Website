import "@babel/polyfill";
import "mutationobserver-shim";
import "./plugins/bootstrap-vue";

import {shared_data} from "./shared_data";
Vue.prototype.$store=shared_data;


import Vue from "vue";
import App from "./App.vue";
import VueAxios from "vue-axios";
import axios from "axios";



import routes from "./routes";
import VueRouter from "vue-router";

import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)

//Global components
import RecipePreview from "./components/RecipePreview";
Vue.component("RecipePreview", RecipePreview);
import Login from "./components/Login";
Vue.component("Login", Login);

Vue.use(VueRouter);
const router = new VueRouter({
  routes
});

import Vuelidate from "vuelidate";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import {
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin
} from "bootstrap-vue";
[
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin
].forEach((x) => Vue.use(x));
Vue.use(Vuelidate);

axios.interceptors.request.use(
    function(config) {
      // Do something before request is sent
      return config;
    },
    function(error) {
      // Do something with request error
      return Promise.reject(error);
    }
);

// Add a response interceptor
axios.interceptors.response.use(
    function(response) {
      // Do something with response data
      return response;
    },
    function(error) {
      // Do something with response error
      return Promise.reject(error);
    }
);

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;




new Vue({
  router,
  methods: {
    toast(title, content, variant = null, append = false) {
      this.$bvToast.toast(`${content}`, {
        title: `${title}`,
        toaster: "b-toaster-top-center",
        variant: variant,
        solid: true,
        appendToast: append,
        autoHideDelay: 3000
      });
    }
  },
  render: (h) => h(App)
}).$mount("#app");

