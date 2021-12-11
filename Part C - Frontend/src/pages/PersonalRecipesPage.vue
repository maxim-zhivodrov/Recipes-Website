<template>
    <div style="text-align:center">
        <h1 style="font-family: Comic Sans MS;">Personal Recipes</h1>
        <br>
        <br>
        <div v-if="recipesLoaded">
            <RecipePreview style="float:left;"
                           v-for="r in recipes"
                           :id="r.id"
                           :title="r.title"
                           :ready-in-minutes="r.readyInMinutes"
                           :image="r.image"
                           :aggregate-likes="r.aggregateLikes"
                           :vegetarian="r.vegetarian"
                           :vegan="r.vegan"
                           :gluten-free="r.glutenFree"
                           :key="r.id"
            />
        </div>
        <img style="position: absolute; left:45%;top:20%" v-else src="../assets/35.gif">
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                name: "PersonalRecipesPage",
                recipes: [],
                recipeChosen: {},
                recipesLoaded: false
            };
        },
        mounted() {
            this.getFavorites();
        },
        methods:{
            async getFavorites(){
                let response;
                try {
                    this.axios.defaults.withCredentials = true;
                    response = await this.axios.get(
                        "http://localhost:3000/users/personalRecipes"
                    );
                    this.recipes=[];
                    this.recipes.push(...response.data);
                    this.recipesLoaded=true;
                } catch (error) {
                    this.recipes.push(...response.data);
                    this.recipesLoaded=true;
                }
            }
        }
    }
</script>

<style scoped>

</style>