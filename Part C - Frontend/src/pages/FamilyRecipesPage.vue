<template>
    <div>
        <div v-if="recipesLoaded">
            <RecipeFamily
                    v-for="r in recipes"
                    :id="r.id"
                    :title="r.title"
                    :family-member="r.familyMember"
                    :image="r.image"
                    :special-occasion="r.specialOccasion"
                    :ingredients="r.ingredients"
                    :instructions="r.instructions"
                    :key="r.id"
            />
        </div>
        <img style="position: absolute; left:45%;top:20%" v-else src="../assets/35.gif">
    </div>
</template>

<script>
    import RecipeFamily from "../components/RecipeFamily";
    export default {
        name: "FamilyRecipesPage",
        components: {
            RecipeFamily
        },
        data() {
            return {
                recipes: [],
                recipesLoaded:false
            };
        },
        mounted(){
            this.getFamilyRecipes();
        },
        methods:{
            async getFamilyRecipes(){
                this.axios.defaults.withCredentials = true;
                let response = await this.axios.get(
                    "http://localhost:3000/users/familyRecipes"
                );
                this.recipes=[];
                this.recipes.push(...response.data);
                this.recipesLoaded=true;
            }
        }
    }

</script>

<style scoped>

</style>