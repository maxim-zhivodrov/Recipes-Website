<template>
    <div class="full_recipe">
    <div class="recipe-preview">
      <img class="center" :src="image" width="100%" >
      <ul class="right_side_props">
        <li><img src="../assets/family_member_icon.png" width="60" height="60"/>   {{ familyMember }}</li>
        <li><img src="../assets/occasion_icon.png" width="60" height="60"/>{{ specialOccasion }}</li>
      </ul>
    </div>
    <h2 style=" text-align: center;"><b>{{ title }}</b></h2>
    <br>
    <div class="recipe-body">
        <div class="row">
          <div class="first_column">
            <h2 style="font-family: Comic Sans MS;"><u>Ingrediants</u></h2>
            <br>
            <ul v-for="i in ingredients" :key="i.ingredient_name">
              <li>
                <ul style="display:inline-block;" class="list-group">
                  <li class="list-group-item disabled">{{ i.ingredient_name }}, {{ i.amount }} {{ i.unit }}</li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="second_column">
            <h2 style="padding-left: 30%; font-family: Comic Sans MS;"><u>Instructions</u></h2>
            <br>
            <ol >
              <li v-for="i in instructions" :key="i.instructionNum">
                <ol  class="list-group">
                  <li class="list-group-item disabled">{{ i.instructionCont }}</li>
                </ol>
              </li>
            </ol>
          </div>
        </div>

    </div>
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
            familyMember: {
                type: String,
                required: true
            },
            specialOccasion: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            ingredients: {
                typr: Array,
                required: true
            },
            instructions: {
                type: Array,
                required: true
            },
        }
    };
</script>


<style scoped>
  .first_column {
    float: left;
    width: 40%;
    padding-left: 15%;
  }
  .second_column {
    float: left;
    width: 50%;
  }
  .row {
  display: flex;
  }
  .center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  /* width: 50%; */
  }

  .right_side_props {
    position: absolute;
    top: 2%;
    right: -160px;
    list-style-type: none; 
  }
  .left_side_props {
    position: absolute;
    top: 2%;
    left: -105px;
    list-style-type: none; 
  }

  .recipe-preview {
    width: 40%;
    border: 1px solid #ccbba5;
    position: relative;
    /* margin: 3px 3px 10px 150px; */
    transition: transform 0.2s;
    display: block;
  margin-left: auto;
  margin-right: auto;
  }


</style>
