<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import Navbar from "@/components/navBar.vue";
export default {
	components: { 
		Navbar
	},
  	data() {
    	return {
      		drawer: true,
			About: "HOME"
    	};
  	},
};
</script>

<style>
#maintenance {
	background-color: rgb(255, 255, 255);
	height: 75%;
	background-position: center;
	background-repeat: repeat;
	background-size: contain;
	position: relative;
}
#letra {
  	font-family: "Merienda", Helvetica, Arial;
}
</style>