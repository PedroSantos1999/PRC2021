<template>
  <div id="maintenance" class="back">
    <Navbar v-bind:title="About" />
    <v-card class="mx-auto justify-center" color="transparent" flat>
      	<v-row justify="center" align="start">
        	<v-col>
          		<v-card class="mx-auto mt-4 text-center justify-center" flat color="transparent" >
        			<v-card-title class="headline justify-center font-weight-medium"> TPC6 </v-card-title>
          		</v-card>
        	</v-col>
      	</v-row>

      	<v-row align="center" justify="center">
        	<v-col>
          	<v-row justify="center" align="start">
            	<v-card class="mx-auto justify-center" color="transparent" flat>
              		<v-card-title class="font-weight-light"> Pedro Afonso Rodrigues Santos - PG42847 </v-card-title>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import Navbar from "@/components/navBar.vue";
export default {
	data: () => ({
		About: "About"
	}),
	
  	components: {
    	Navbar,
  	},
};
</script>

<style>
#maintenance {
	background-color: rgb(255, 255, 255);
  	height: 100%;
  	background-position: center;
  	background-repeat: repeat;
  	background-size: contain;
  	position: relative;
}
#letra {
	font-family: "Merienda", Helvetica, Arial;
}
</style>
