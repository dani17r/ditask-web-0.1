<template>
<div class="fixed-center text-center">
	<!-- <p>
		<img src="~assets/sad.svg" style="width:30vw;max-width:150px;" />
	</p> -->
    <q-btn color="primary" style="width:200px;" to="/" label="inicio" />
    <br> <br>
	<p class="text-faded">
		Lo sentimos, no existe esta ruta... <strong>Error 404</strong>
	</p>
	<hr> <br>
	<q-btn color="secondary" style="width:200px;" @click="goBack()" label="atras" />
</div>
</template>

<script>
import myMixin from "../mixins/myMixin.js"
export default {
	name: "Error404",
    mixins: [myMixin],
};
</script>
