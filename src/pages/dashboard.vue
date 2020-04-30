<template>
	<div class="flex dashboard">
		<a class="gosh" @click="prompt = true">
      		<span>nuevo tablero</span>
    	</a>
		<div class="tableros"
			v-for="tablero in tableros" :key="tablero.key"
			@click="abrirTableroM(tablero._id)">
			<span>{{tablero.name}}</span>
		</div>

		<!-- ************************************* -->
		<q-dialog v-model="prompt">
			<q-card style="min-width: 350px">
				<q-card-section>
				    <div class="text-h6">Nuevo tablero</div>
				</q-card-section>
		        <q-card-section>
		          	<q-input dense
						autofocus placeholder="titulo del tablero"
						v-model="name"/>
		        </q-card-section>

				<q-card-section>
					<q-input dense
						autofocus placeholder="descripcion del tablero"
						v-model="description"/>
				</q-card-section>

		        <q-card-actions align="right" class="text-primary">
		          <q-btn flat label="Cancel" v-close-popup />
		          <q-btn flat label="Agregar"
				  		v-close-popup
				  		@click="newTablero"/>
		        </q-card-actions>
	      </q-card>
	    </q-dialog>

		<q-dialog v-model="lockTableroTrueDialog" persistent>
			<q-card style="min-width: 350px">
				<q-card-section>
					<div class="text-h6">
						Desbloquear tablero
					</div>
					<p v-if="passwordError!=null" class="passwordError">
						{{ passwordError }}
					</p>
				</q-card-section>

				<q-card-section class="q-pt-none">
					<q-input dense v-model="password" autofocus :type="isPwd ? 'password' : 'text'"
						placeholder="contraseña"
						@keyup.enter="unlockTableroA({tableroActual, password})">
				        <template v-slot:append>
				          <q-icon
				            :name="isPwd ? 'visibility_off' : 'visibility'"
				            class="cursor-pointer"
				            @click="isPwd = !isPwd"
				          />
				        </template>
			      	</q-input>
				</q-card-section>

				<q-card-actions align="right" class="text-primary">
					<q-btn flat label="Cancelar"
						@click="cancelUnlockTableroM()" />
					<q-btn flat label="Aceptar"
						@click="unlockTableroA({tableroActual, password})" />
				</q-card-actions>
			</q-card>
		</q-dialog>
  </div>
</template>

<script>
	import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
	import axios from 'axios'
	export default {
	  name: 'dasboard',
	  data () {
	    return {
			prompt: false,
		    name: '',
			description: '',
			password:'',
			isPwd: true,
	    }
	  },
	  	computed: {
			...mapState('tableros', ['tableros','tableroActual',
				'lockTableroTrueDialog', 'passwordError']),
		},
		watch: {
		 	lockTableroTrueDialog(){
				this.password = ''
				this.clearPasswordError()
		 	},
		},
	  	methods:{
			...mapActions('tableros', ['unlockTableroA']),
			...mapMutations('tableros', ['allTablerosM','newTableroM',
				'stateLockAndUnlockM','abrirTableroM','lockTableroTrueDialogM',
				'cancelUnlockTableroM','clearPasswordError'
			]),
			newTablero(){
				this.newTableroM({
					name: this.name,
					description: this.description
				})
				this.name= ''
				this.description= ''
			},
	  	},
	  	mounted() {
			this.allTablerosM()
	  	},
	}
</script>

<style>
	.passwordError{
		color: red;
	}
	.gosh{
		width: 150px;
	    height: 85px;
	    margin: 10px;
		display: flex;
		align-items: center;
		background-color: #e8e8e8;
	    color: white;
		text-align: center;
		padding: 20px;
		border-radius: 5px;
		cursor: pointer;
		text-decoration: none;
	}
	.tableros{
		width: 150px;
	    height: 85px;
	    margin: 10px;
	    background-color: #758e92;
	    color: white;
	    padding: 20px;
	    border-radius: 5px;
	    cursor: pointer;
	    text-decoration: none;
	}
	.dashboard {
		justify-content: space-between;
		padding: 20px;
		margin: 10px auto;
	}
</style>
