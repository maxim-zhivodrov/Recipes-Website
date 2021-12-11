<template>
    <div>
        <div v-if="recipeLoaded">
            <RecipeFull
                :id="recipe.previewItems.id"
                :title="recipe.previewItems.title"
                :ready-in-minutes="recipe.previewItems.readyInMinutes"
                :image="recipe.previewItems.image"
                :aggregate-likes="recipe.previewItems.aggregateLikes"
                :vegetarian="recipe.previewItems.vegetarian"
                :vegan="recipe.previewItems.vegan"
                :gluten-free="recipe.previewItems.glutenFree"
                :ingredients="recipe.ingredients"
                :instructions="recipe.instructions"
                :numOfDiners="recipe.numOfDiners"
                :inFavorites="recipe.inFavorites"
                :watched="recipe.watched"
                :is-personal-recipe="isPersonalRecipe"
            />
        </div>
        <img v-else src="../assets/35.gif" style="position: absolute; left:45%;top:30%">
    </div>

    
</template>

<script>
    import RecipeFull from "../components/RecipeFull";
    export default {
        name: "RecipeFullPage",
        components: {
            RecipeFull
        },
        data() {
            return {
                recipe: {},
                recipeLoaded:false,
                isPersonalRecipe: false
            };
        },
        mounted(){
            this.getFullRecipe();
            this.watchRecipe();
        },
        methods:{
            async getFullRecipe(){
                let response;
                try{
                    this.isPersonalRecipe=(this.$route.params.recipeId+"").includes("-");
                    if(this.isPersonalRecipe){
                        response = await this.axios.get("http://localhost:3000/users/personalRecipePage/recipeID/"+this.$route.params.recipeId);
                    }
                    else{
                        response = await this.axios.get("http://localhost:3000/recipes/recipePage/recipeID/"+this.$route.params.recipeId);
                    }
                    if(window.$cookies.isKey('session')&&!this.isPersonalRecipe)
                    {
                        let id = "["+response.data.previewItems.id+"]";
                        const infos = await this.axios.get(
                            "http://localhost:3000/users/userRecipeInfo/" + id
                        );
                        // response.data.forEach(recipe => {
                            for (const [key, value] of Object.entries(infos.data)) {
                                if (response.data.previewItems.id == key) {
                                    response.data.watched = value.watched;
                                    response.data.inFavorites = value.inFavorites;
                                }
                            }
                        // });
                    }
                    if(this.isPersonalRecipe)
                        this.recipe=response.data[0];
                    else
                        this.recipe=response.data;
                }
                catch(error){
                    this.recipe=response.data;
                }
                
                this.recipeLoaded=true;
            },
            async watchRecipe(){
                this.isPersonalRecipe=(this.$route.params.recipeId+"").includes("-");
                if(window.$cookies.isKey('session')&&!this.isPersonalRecipe)
                {
                    let response = await this.axios.post("http://localhost:3000/users/watchRecipe",
                    {
                        recipeID:this.$route.params.recipeId
                    });
                    this.recipe=response.data;
                }
                
            }
        }
    }

</script>

<style scoped>

</style>