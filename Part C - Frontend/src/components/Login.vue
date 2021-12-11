<template>
  <div class="container">
    <h1 class="title" style="font-family: Comic Sans MS;">Login</h1>
    <b-form @submit.prevent="onLogin">
      <b-form-group
        id="input-group-Username"
        label-cols-sm="3"
        label="Username:"
        label-for="Username"
      >
        <b-form-input
          id="Username"
          v-model="$v.form.username.$model"
          type="text"
          :state="validateState('username')"
        ></b-form-input>
        <b-form-invalid-feedback>
          Username is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-Password"
        label-cols-sm="3"
        label="Password:"
        label-for="Password"
      >
        <b-form-input
          id="Password"
          type="password"
          v-model="$v.form.password.$model"
          :state="validateState('password')"
        ></b-form-input>
        <b-form-invalid-feedback>
          Password is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button
        type="submit"
        variant="primary"
        style="width:100px;display:block;"
        class="mx-auto w-100"
        >Login</b-button
      >
      <div class="mt-2">
        Do not have an account yet?
        <router-link to="register"> Register here</router-link>
      </div>
    </b-form>
    <b-alert
      class="mt-2"
      v-if="form.submitError"
      variant="warning"
      dismissible
      show
    >
      Login failed: {{ form.submitError }}
    </b-alert>
    <!-- <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card> -->
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
        submitError: undefined
      }
    };
  },
  validations: {
    form: {
      username: {
        required
      },
      password: {
        required
      }
    }
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async Login() {
      try {
        await this.axios.post("http://localhost:3000/auth/login", {
          username: this.form.username,
          password: this.form.password
        });
        this.updateParent();
      } catch (err) {
        console.log(err.response);
        this.form.submitError = err.response.data.message;
      }
      // this.$store.username=this.form.username;
      // localStorage.setItem("username", this.form.username);
      this.$localStorage.set("username", this.form.username);
    },
    onLogin() {
      // console.log("login method called");
      this.form.submitError = undefined;
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      // console.log("login method go");

      this.Login();
    },
    updateParent(){
      let parentName=this.$parent.$data.name;
      if(parentName=="LoginPage"){
        this.$parent.$parent.$data.hasCookie=window.$cookies.isKey('session');
        this.$router.push("/");
      }
      else{
        this.$parent.$parent.$data.hasCookie=window.$cookies.isKey('session');
        this.$parent.$data.hasCookie=window.$cookies.isKey('session');
        this.$emit('clicked',true);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  max-width: 400px;
}
</style>
