
<template>
    <div style="text-align:center" >
        <h1 style="font-family: Comic Sans MS;" >Search recipes</h1>
        <input
                v-model="searchQuery"
                type="text"
                placeholder="Enter search query"
                required
        />
        <button @click="search">search</button>
        <br>
        <br>
        <b-form-group label="Number of results:">
            <b-form-radio-group
                    v-model="selectedNum"
                    :options="optionsNum"
                    name="radio-inline"
            ></b-form-radio-group>
        </b-form-group>

        <b-form-group label="Filter categories:">
            <b-form-select label="Street:" class="w-25" v-model="selectedCuisine" :options="optionsCuisine"></b-form-select>
            <!-- <br /> -->
            <b-form-select class="w-25" v-model="selectedDiet" :options="optionsDiet"></b-form-select>
            <!-- <br /> -->
            <b-form-select class="w-25" v-model="selectedIntolerance" :options="optionsIntolerance"></b-form-select>
        </b-form-group>

        <button @click="sortByMakingTime">Sort by making time</button>
        <button @click="sortByPopularity">Sort by popularity</button>
        <br>
        <br>
        <b-alert  v-model="showDismissibleAlert" variant="warning" dismissible style="text-align:center">
            No recipes found for the inserted query
        </b-alert>
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
                    :inFavorites="r.inFavorites"
                    :watched="r.watched"
                    :key="r.id"
            />
        </div>
        <img v-else-if="clickedSearch" src="../assets/35.gif">

    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                name: "SearchPage",
                showDismissibleAlert:false,
                selectedCuisine: null,
                optionsCuisine: [
                    { value: null, text: 'Please select an cuisine' },
                    { value: 'African', text: 'African' },
                    { value: 'American', text: 'American' },
                    { value: 'British', text: 'British' },
                    { value: 'Cajun', text: 'Cajun' },
                    { value: 'Caribbean', text: 'Caribbean' },
                    { value: 'Chinese', text: 'Chinese' },
                    { value: 'Eastern European', text: 'Eastern European' },
                    { value: 'European', text: 'European' },
                    { value: 'French', text: 'French' },
                    { value: 'German', text: 'German' },
                    { value: 'Greek', text: 'Greek' },
                    { value: 'Indian', text: 'Indian' },
                    { value: 'Irish', text: 'Irish' },
                    { value: 'Italian', text: 'Italian' },
                    { value: 'Japanese', text: 'Japanese' },
                    { value: 'Jewish', text: 'Jewish' },
                    { value: 'Korean', text: 'Korean' },
                    { value: 'Latin American', text: 'Latin American' },
                    { value: 'Mediterranean', text: 'Mediterranean' },
                    { value: 'Mexican', text: 'Mexican' },
                    { value: 'Middle Eastern', text: 'Middle Eastern' },
                    { value: 'Nordic', text: 'Nordic' },
                    { value: 'Southern', text: 'Southern' },
                    { value: 'Spanish', text: 'Spanish' },
                    { value: 'Thai', text: 'Thai' },
                    { value: 'Vietnamese', text: 'Vietnamese' },
                ],
                selectedDiet: null,
                optionsDiet: [
                    { value: null, text: 'Please select an diet' },
                    { value: 'Gluten Free', text: 'Gluten Free' },
                    { value: 'Ketogenic', text: 'Ketogenic' },
                    { value: 'Vegetarian', text: 'Vegetarian' },
                    { value: 'Lacto-Vegetarian', text: 'Lacto-Vegetarian' },
                    { value: 'Ovo-Vegetarian', text: 'Ovo-Vegetarian' },
                    { value: 'Vegan', text: 'Vegan' },
                    { value: 'Pescetarian', text: 'Pescetarian' },
                    { value: 'Paleo', text: 'Paleo' },
                    { value: 'Primal', text: 'Primal' },
                    { value: 'Whole30', text: 'Whole30' },
                ],
                selectedIntolerance: null,
                optionsIntolerance: [
                    { value: null, text: 'Please select an intolerance' },
                    { value: 'Dairy', text: 'Dairy' },
                    { value: 'Egg', text: 'Egg' },
                    { value: 'Gluten', text: 'Gluten' },
                    { value: 'Grain', text: 'Grain' },
                    { value: 'Peanut', text: 'Peanut' },
                    { value: 'Seafood', text: 'Seafood' },
                    { value: 'Sesame', text: 'Sesame' },
                    { value: 'Shellfish', text: 'Shellfish' },
                    { value: 'Soy', text: 'Soy' },
                    { value: 'Sulfite', text: 'Sulfite' },
                    { value: 'Tree nut', text: 'Tree nut' },
                    { value: 'Wheat', text: 'Wheat' },
                ],
                selectedNum: '5',
                optionsNum: [
                    { text: '5', value: '5' },
                    { text: '10', value: '10' },
                    { text: '15', value: '15' }
                ],
                recipes: [],
                searchQuery:"",
                recipesLoaded:false,
                clickedSearch:false
            };
        },
        mounted(){
            this.updateLastSearch();
        },
        methods:{
            async search(){
                this.clickedSearch=true;
                let queryParams={};
                if(this.selectedCuisine!=null) queryParams.cuisine=this.selectedCuisine;
                if(this.selectedDiet!=null) queryParams.diet=this.selectedDiet;
                if(this.selectedIntolerance!=null) queryParams.intolerances=this.selectedIntolerance;

                let response = await this.axios.get(
                    "http://localhost:3000/recipes/search/query/" + this.searchQuery + "/numToShow/" + this.selectedNum, {
                        params: queryParams
                    }
                );
                if(response.data.message){
                    this.showDismissibleAlert=true;
                    this.recipes=[];
                }
                else{
                    this.showDismissibleAlert=false;
                    this.recipes = [];
                    if(window.$cookies.isKey('session'))
                    {
                        let ids = "[";
                        response.data.forEach(recipe => {
                        ids = ids + recipe.id + ",";
                        });
                        ids = ids.substring(0, ids.length - 1) + "]";
                        const infos = await this.axios.get(
                        "http://localhost:3000/users/userRecipeInfo/" + ids
                        );
                        response.data.forEach(recipe => {
                        for (const [key, value] of Object.entries(infos.data)) {
                            if (recipe.id == key) {
                            recipe.watched = value.watched;
                            recipe.inFavorites = value.inFavorites;
                            }
                        }
                        });
                    }
                    this.recipes.push(...response.data);
                }
                if(this.$localStorage.get('username')!="")
                    this.$store.lastSearch=this.recipes;
                // if(this.$localStorage.get('username')!="")
                    // this.$localStorage.set('lastSearch',this.recipes);

                this.recipesLoaded=true;

            },
            sortByMakingTime(){
                this.recipes.sort((a,b)=>{
                    return a.readyInMinutes-b.readyInMinutes;
                })
            },
            sortByPopularity(){
                this.recipes.sort((a,b)=>{
                    return b.aggregateLikes-a.aggregateLikes;
                })
            },
            updateLastSearch(){
                if(this.$localStorage.get('username')!="")
                {
                    this.recipes=this.$store.lastSearch;
                    this.recipesLoaded=true;
                    // this.recipes=this.$localStorage.get('lastSearch');
                    // this.recipesLoaded=true;
                }
            }
        }
    };
</script>

<style></style>
