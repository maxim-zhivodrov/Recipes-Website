<template>
    <div>
        <h1 style="text-align:center; font-family: Comic Sans MS;">Favorite Recipes</h1>
        <br>
        <br>
        <div v-if="recipesLoaded" >
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
                    :in-favorites="r.inFavorites"
                    :watched="r.watched"
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
                name: "FavoritesPage",
                recipes: [],
                recipeChosen: {},
                recipesLoaded:false
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
                        "http://localhost:3000/users/favorites"
                    );

                    this.recipes = [];
                    let ids = "[";
                    response.data.forEach(recipe => {
                        ids = ids + recipe.id + ",";
                    });
                    ids = ids.substring(0, ids.length - 1) + "]";

                    const infos = await this.axios.get(
                        "http://localhost:3000/users/userRecipeInfo/" + ids
                    );
                    console.log(infos);
                    response.data.forEach(recipe => {
                        for (const [key, value] of Object.entries(infos.data)) {
                            if (recipe.id == key) {
                                recipe.watched = value.watched;
                                recipe.inFavorites = value.inFavorites;
                            }
                        }
                    });
                    this.recipes.push(...response.data);
                } catch (error) {
                    this.recipes.push(...response.data);
                }
                this.recipesLoaded=true;
            }
        }
    }
</script>

<style scoped>

</style>