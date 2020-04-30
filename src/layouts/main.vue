<template>
<q-layout view="lHh Lpr lFf" style="min-height: auto;">
	<q-header elevated class="barra">
		<q-toolbar>
			<q-btn flat dense round icon="menu"
				@click="drawerLeft = !drawerLeft"/>

			<q-toolbar-title>
				<router-link class="title-principal" to="/">
					Ditask
				</router-link>
			</q-toolbar-title>

			<!-- boton de atras -->
			<div class="mr-10">
				<a class="title-principal"
					@click="goBack()"
					v-show="routeUpdate">
					<q-btn icon="keyboard_backspace"
						label="Atras"
						outline	/>
				</a>
			</div>

			<!-- boton de configuracion - menu right -->
			<q-btn flat round dense
				v-show="routeUpdate"
			 	@click="drawerRight = !drawerRight"
				icon="settings"/>
		</q-toolbar>
	</q-header>

	<q-drawer v-model="drawerLeft"
		content-class="bg-grey-3"
		behavior="mobile"
		overlay>

		<q-list>
			<q-item clickable v-ripple header
				@click="urlInicioActive">
			  <q-item-section>
				  <h6 class="h5-taberos" >
  					Tableros
  				</h6>
			  </q-item-section>
			</q-item>

			<q-separator />
			<q-item clickable
				tag="a"
				v-for="tablero in treePrimaryTableros"
				:key="tablero.key"
				@click="abrirTableroM(tablero._id)"
				:class="pathActual == '/tablero/'+tablero._id ? 'active_': ''">
				<q-item-section avatar>
					<q-icon name="assignment"/>
				</q-item-section>
				<q-item-section>
					<q-item-label>{{ tablero.name }}</q-item-label>
					<q-item-label caption>{{ tablero.description }}</q-item-label>
				</q-item-section>
			</q-item>

			<q-item class="papelera"
				tag="a" v-show="$route.path !='/dashboard'"
				clickable
				@click="papeleraDialog = true, drawerLeft=false">
				<q-item-section avatar>
					<q-icon name="delete_forever"/>
				</q-item-section>
				<q-item-section>
					<q-item-label>Papelera</q-item-label>
				</q-item-section>
			</q-item>
		</q-list>
	</q-drawer>

	<q-page-container>
		<router-view />
	</q-page-container>

	<q-drawer v-model="drawerRight"
		content-class="bg-grey-3"
		behavior="mobile"
		:breakpoint="500"
		side="right"
		:width="200"
		overlay>

		<q-scroll-area class="fit">
		  <q-list>

			<q-item header>
			  <q-item-section>
				  <h6 class="h5-taberos" >
  					configuraciones
  				</h6>
			  </q-item-section>
			</q-item>

		   <q-separator />

		   <!-- Boton Cambiar Nombre -->
		   <q-item clickable v-ripple
		   		@click="renombreDialog = true">
			 <q-item-section avatar>
			   <q-icon name="description" />
			 </q-item-section>
			 <q-item-section>
			   Renombrar
			 </q-item-section>
		   </q-item>

		   <!-- Boton eliminar -->
		   <q-item clickable v-ripple
		   		@click="deleteTableroDialog = true" >
				<q-item-section avatar>
				   <q-icon name="delete" />
				</q-item-section>
				<q-item-section>
				   Eliminar
				</q-item-section>
		   </q-item>

		   <!-- Colocar contraseña -->
		   <q-item clickable v-ripple @click="lockAndUnlock()">
			 <q-item-section avatar>
			   <q-icon name="lock" />
			 </q-item-section>
			 <q-item-section>
				 <span v-if="lockAndUnlockPasswordState">Unlock Opciones</span>
				 <span v-else>Lock tablero</span>
			 </q-item-section>
		   </q-item>

		  </q-list>
		</q-scroll-area>
	</q-drawer>

	<!-- dialog -->
	<q-dialog v-model="papeleraDialog"
		:maximized="maximizedToggle"
		transition-hide="slide-down"
		transition-show="slide-up"
		persistent>
		<q-card style="background-color:#ffffff;">
			<q-bar class="text-white bg-primary">
				<q-space />
				<q-btn dense flat icon="close" v-close-popup style="font-size: 14px;" />
			</q-bar>

			<q-card-section class="seccion-opciones" style="padding-left:30px;">
				<q-badge color="primary"
					style="padding:5px"
					:label="'total: '+deleteItems_.length"
					text-color="white"/>

				<q-btn @click="revers()"
					class="q-btn-revers"
					size="9px"
				 	color="primary"
					:icon="orderSub ? 'keyboard_arrow_up':'keyboard_arrow_down'">
				 </q-btn>

				<q-btn v-show="listVisualTask"
					icon="keyboard_backspace"
					label="Regresar"
					color="primary" rounded
					@click="listVisualTask=false, listVisualOneComponent=''"
					style="float:right;"/>

				<br v-show="listVisualTask"><br v-show="listVisualTask">

				<q-btn-dropdown class="deleteLista"
					@click="selectList!='' ? deleteListPapeleraSelect() : '', listVisualTask ? deleteListPapeleraOne() : ''"
					v-show="selectDeleteState==false || selectList!=''"
					:fab-mini="selectList!='' || listVisualTask ? false: true"
					:disable-dropdown="selectList!='' || listVisualTask || selectDeleteState ? true:false"
					:label="selectList!='' || listVisualTask? 'Borrar':''"
					color="red" icon="delete" rounded
					style="float:right;">
					<q-list>
						<q-item clickable v-close-popup
							@click="selectDeleteState = !selectDeleteState">
							<q-item-section>
								<q-item-label>Selcionar y borrar</q-item-label>
							</q-item-section>
						</q-item>

						<q-item clickable v-close-popup @click="deleteListPapeleraAll()">
							<q-item-section>
								<q-item-label>Borrar todo</q-item-label>
							</q-item-section>
						</q-item>
					</q-list>
				</q-btn-dropdown>

				<br v-show="selectDeleteState && selectList!=''"><br v-show="selectDeleteState && selectList!=''">

				<q-btn v-show="selectDeleteState"
					icon="backspace"
					label="Cancelar" rounded
					color="primary" @click="cancelSelectDelete()"
					style="float:right; margin-left:10px;"/>

			</q-card-section>

			<q-card-section class="seccion-papelera" v-if="listVisualTask == false"
				:style="selectDeleteState && selectList!='' ? 'margin-top: -21px;':''">
				<div class="col-12 col-sm-6 col-md-4 task m-5"
					:class="listVisualTask ? 'task_delete_expand': 'task_delete'"
					:style="'background-color:'+item.color.bg"
					@click="selectListDelete(item, item._id)"
					v-for="(item, index) in deleteItems_"
					:key="index">
					<q-checkbox class="q-check-modif"
						v-show="selectDeleteState"
						v-model="selectList"
						:val="item._id"/>
					<span class="tittle-tablero"
						:style="'border-color:'+item.color.tx">
						<p class="new-tarea"
							:style="'color:'
							+item.color.tx">
							{{item.name}}
						</p>
					</span>
				</div>

			</q-card-section>

			<q-card-section class="seccion-papelera" v-else
				:style="listVisualTask ? 'margin-top: -21px;':''">
				<div class="col-12 col-sm-6 col-md-4 task m-5"
					:class="listVisualTask ? 'task_delete_expand': 'task_delete'"
					:style="'background-color:'+listVisualOneComponent.color.bg">
					<span class="tittle-tablero"
						:style="'border-color:'+listVisualOneComponent.color.tx">
						<p class="new-tarea"
							:style="'color:'+listVisualOneComponent.color.tx">
							{{listVisualOneComponent.name}}
						</p>
					</span>
					<div>
						<div class="item-tasks item" style="color:black;"
							:style="listVisualOneComponent.disable == false ? 'background-color:#f3f3f359':''"
							v-for="task in listVisualOneComponent.list"
							:key="task._id">
							{{ task.title }}
						</div>
					</div>
				</div>
			</q-card-section>

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

	<q-dialog v-model="renombreDialog">
		<q-card style="min-width: 350px">

			<q-card-section>
			  	<div class="text-h6">Nuevo nombre para tablero</div>
			</q-card-section>

			<q-card-section class="q-pt-none">
				<!-- v-model="renombre" -->
				<q-input dense autofocus
					v-model="renombre = tableroActual.name"
					@keyup.enter="renombreDialog = false" />
			</q-card-section>

			<q-card-actions align="right" class="text-primary">
				<q-btn flat label="Cancelar" v-close-popup @click="updateNameCancel()"/>
				<q-btn flat label="Aceptar" v-close-popup @click="changesNameTablero()"/>
			</q-card-actions>
    	</q-card>
	</q-dialog>

	<q-dialog v-model="deleteTableroDialog" persistent
		transition-show="scale"
		transition-hide="scale">
		<q-card class="text-white" style="width: 300px; background-color:#68007C;">
			<q-card-section>
			  	<div class="text-h6">Elimar tablero</div>
			</q-card-section>

			<q-card-section class="q-pt-none">
			  	Esta seguro que quiere eliminar el tablero?
			</q-card-section>

			<q-card-actions align="right" class="bg-white" style="color:#68007C;">
			  	<q-btn flat label="No" v-close-popup />
			  	<q-btn flat label="Si" v-close-popup @click="deleteTablero()"/>
			</q-card-actions>
		</q-card>
	</q-dialog>

	<q-dialog v-model="lockTableroDialog" persistent>
		<q-card style="min-width: 350px">
			<q-card-section>
				<div class="text-h6">
					Bloqueo de tablero con contraseña
				</div>
				<strong class="text-primary"
					v-show="password.length < 4 || passwordRepeat.length < 4"
					inline-actions>
						 No pueden haber menos de 4 digitos
				</strong>
			</q-card-section>

			<q-card-section class="q-pt-none">
				<q-input dense v-model="password" autofocus
					placeholder="Contraseña"
					:type="isPwd ? 'password' : 'text'"
					@keyup.enter="lockTableroDialog = false">
					<template v-slot:append>
						<q-icon
						:name="isPwd ? 'visibility_off' : 'visibility'"
						class="cursor-pointer"
						@click="isPwd = !isPwd"
						/>
					</template>
				</q-input>
				<br>
				<q-input dense v-model="passwordRepeat" autofocus
					placeholder="repetir contraseña"
					:type="isPwd ? 'password' : 'text'"
					@keyup.enter="lockTableroDialog = false">
					<template v-slot:append>
						<q-icon
						:name="isPwd ? 'visibility_off' : 'visibility'"
						class="cursor-pointer"
						@click="isPwd = !isPwd"
						/>
					</template>
				</q-input>
				<br>
				<q-banner class="text-white bg-red"
					v-show="password != passwordRepeat
						&& password.length >= 4
						&& passwordRepeat.length >= 4"
					inline-actions>
				    Las claves no coinsiden
				</q-banner>
			</q-card-section>

			<q-card-actions align="right" class="text-primary">
				<q-btn flat label="Cancelar" v-close-popup />
				<q-btn flat label="Aceptar" v-close-popup
					v-show="password == passwordRepeat
						&& password.length >= 4
						&& passwordRepeat.length >= 4"
					@click="lockTableroActual($route.params.id)"/>
			</q-card-actions>
		</q-card>
	</q-dialog>

	<q-dialog v-model="optionsLockAndUnlockDialog" @blur="decline()">
		<q-card style="width: 700px; max-width: 80vw;">
			<q-card-section>
				<div class="text-h6">Opciones de contraseña</div>
			</q-card-section>

			<q-card-section class="q-pt-none">
				<div class="Disable-Password-Temporal">
					<q-item tag="label"
						v-ripple
						class="disableTimePassword">
						<q-checkbox class="text-subtitle2"
							:value="disablePasswordTemporalIf"
							v-model="disablePasswordTemporal"
							label="Desactivar contraseña"
							left-label/>
					</q-item>
					<q-expansion-item v-model="disablePasswordTemporal"
						class="disableTimePassword"
						style="margin-top: -52px;">
						<q-card-section class="q-gutter-sm">
							<q-radio dense :value="timeDisablePasswordIf" v-model="timeDisablePassword" val="2h" label="2 horas" />
							<q-radio dense :value="timeDisablePasswordIf" v-model="timeDisablePassword" val="4h" label="4 horas" />
							<q-radio dense :value="timeDisablePasswordIf" v-model="timeDisablePassword" val="1d" label="1 dia" />
							<q-radio dense :value="timeDisablePasswordIf" v-model="timeDisablePassword" val="1sm" label="1 semana" />
							<q-radio dense :value="timeDisablePasswordIf" v-model="timeDisablePassword" val="t" label="temporalmente" />
						</q-card-section>
					</q-expansion-item>
				</div>
				<div class="Update-Password">
					<q-expansion-item v-model="updatePassword"
						label="Cambiar contraseña"
						class="text-subtitle2">
						<q-card-section class="q-gutter-sm">
							<strong class="text-primary"
								v-show="this.msjError!=''">
								{{ this.msjError }}
							</strong>
							<div class="block">
								<q-input :dense="true" v-model="password" autofocus
									placeholder="Nueva contraseña"
									class="q-input-password"
									style="margin-right: 35px;"
									:type="isPwd ? 'password' : 'text'"
									@keyup.enter="lockTableroDialog = false">
								<template v-slot:append>
									<q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
									class="cursor-pointer"
									@click="isPwd = !isPwd"/>
								</template>
								</q-input>

								<q-input :dense="true" v-model="passwordRepeat"
									placeholder="Repetir contraseña"
									class="q-input-password"
									:type="isPwd ? 'password' : 'text'"
									@keyup.enter="lockTableroDialog = false">
								</q-input>
							</div>
						</q-card-section>
					</q-expansion-item>
				</div>
				<div class="delete-Password">
					<q-item tag="label" @click="deletePasswordUnlock()"
						style="padding-top: 13px;"
						v-ripple>
						<span class="text-subtitle2">Quitar contraseña</span>
					</q-item>
				</div>
			</q-card-section>

			<q-card-actions align="right" class="bg-white text-teal">
				<q-btn flat label="Cancelar" v-close-popup @click="decline()"/>
				<q-btn flat label="Aceptar" @click="accept()"/>
			</q-card-actions>
		</q-card>
   </q-dialog>

   <q-dialog v-model="acceptPasswordDialog" persistent>
	   <q-card style="min-width: 350px">
		   <q-card-section>
			   <div class="text-h6">
				   Ingresar contraseña actual
			   </div>
			   <p v-if="passwordError!=null" class="passwordError">
				   {{ passwordError }}
			   </p>
		   </q-card-section>

		   <q-card-section class="q-pt-none">
			   <q-input dense v-model="passwordAccept" autofocus :type="isPwd2 ? 'password' : 'text'"
				   placeholder="contraseña"
				   @keyup.enter="changePasswordAccept()">
				   <template v-slot:append>
					 <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'"
					   class="cursor-pointer"
					   @click="isPwd2 = !isPwd2"/>
				   </template>
			   </q-input>
		   </q-card-section>

		   <q-card-actions align="right" class="text-primary">
			   <q-btn flat label="Cancel"
				   @click="decline()" />
			   <q-btn flat label="Ok"
				   @click="changePasswordAccept()" />
		   </q-card-actions>
	   </q-card>
   </q-dialog>

</q-layout>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex"
import myMixin from "../mixins/myMixin.js"
export default {
	name: "MyLayout",
	mixins: [myMixin],
	data() {
		return {
			optionsLockAndUnlockDialog: false,
			disablePasswordTemporal: false,
			acceptPasswordDialog: false,
			deleteTableroDialog: false,
			listVisualOneComponent: '',
			lockTableroDialog: false,
			selectDeleteState: false,
			pathActual: "/dashboard",
			timeDisablePassword:'',
			maximizedToggle: true,
			renombreDialog: false,
			papeleraDialog: false,
			listVisualTask: false,
			deletePassword: false,
			updatePassword:false,
			drawerRight: false,
			drawerLeft: false,
			passwordRepeat:'',
			passwordAccept:'',
			orderSub: false,
			selectList:[],
			isPwd2: true,
			isPwd: true,
			password:'',
			renombre:'',
			msjError:'',
			desert: {
		        Icecream: false,
		        Eclair: false,
		    }
		}
	},
	computed: {
		...mapState('tableros', ['tableros','tableroActual','lockTableroTrueDialog','passwordError']),
		...mapState("listas", ["itemsDeleteTrue"]),
		treePrimaryTableros() {
			let copyTableros = this.tableros.slice()
			return copyTableros.splice(0, 3)
		},
		routeUpdate() {
			return this.pathActual != "/dashboard"
		},
		deleteItems_(){
			return this.itemsDeleteTrue.filter(a => a.delete == true).reverse()
		},
		lockAndUnlockPasswordState(){
			if (this.tableroActual.lock != undefined) {
				return this.tableroActual.lock.password == undefined || '' ? false : true
			} else return true
		},
		disablePasswordTemporalIf: {
			get: function() {
				if (this.tableroActual.lock != undefined) {
					if (this.tableroActual.lock.disableTime != undefined || '') {
						return this.disablePasswordTemporal = true
					} else {
						return this.disablePasswordTemporal = false
					}
				} else return this.disablePasswordTemporal = false
			},
			set: function (value) {
				return this.disablePasswordTemporal = value
			}
		},
		timeDisablePasswordIf: {
			get: function() {
				if (this.tableroActual.lock != undefined) {
					if (this.tableroActual.lock.disableTime != undefined || '') {
						return this.timeDisablePassword = this.tableroActual.lock.disableTime
					} else {
						return this.timeDisablePassword = 't'
					}
				} else return this.timeDisablePassword = 't'
			},
			set: function (value) {
				return this.timeDisablePassword = value
			}
		},
	},
	methods: {
		...mapActions('tableros', ['unlockTableroA']),
		...mapMutations("listas", ["allListaTablerosDeleteTrueM","deleteAllListaM","deleteOneAllListaM"]),
		...mapMutations('tableros', ['allTablerosM','newTableroM',
			'stateLockAndUnlockM','abrirTableroM','lockTableroTrueDialogM',
			'cancelUnlockTableroM','tableroActualM','clearPasswordError',
			'allTablerosM','chengePasswordError',
		]),
		lockAndUnlock(){
			if (this.lockAndUnlockPasswordState) this.optionsLockAndUnlockDialog = true
			else this.lockTableroDialog = true
		},
		urlInicioActive(){
			this.pathActual != '/dashboard' ? this.$router.push('/') : ''
		},
		updateNameCancel(){
			this.$nextTick(function () {
				this.tableroActualM(this.$route.params.id)
			})
		},
		deletePasswordUnlock(){
			this.deletePassword = true
			this.acceptPasswordDialog = true
		},
		async changesNameTablero(){
			try {
				await axios.post(UrlApp+'edit/tablero/'+this.$route.params.id, {
					name: this.renombre
				})
				this.drawerRight=false
				this.$nextTick(function() {
					this.allTablerosM()
				})
			} catch (e) {
				console.log('ChangesNameTablero error: '+e);
			}
		},
		async deleteTablero(){
			try {
				await axios.post(UrlApp+'delete/tablero/'+this.$route.params.id)
				this.$router.push('/')
			} catch (e) {
				console.log('DeleteTablero error: '+e);
			}
		},
		async deletePasswordLockTablero(){
			try {
				let resp = await axios.post(`${UrlApp}edit/tablero/${this.$route.params.id}`,
					{ state: false, lock:{} })
				this.$nextTick(function() {
					this.tableroActualM(this.$route.params.id)
				})
			} catch (e) {
				console.log('DeletePasswordLockTablero error: '+e);
			}
		},
		async lockTableroActual(_id){
			try {
				let resp = await axios.post(`${UrlApp}lock/tablero/${_id}`, {
					state:true, lock:{ state: true, password: this.password }
				})
				this.drawerRight=false
				this.$nextTick(function() {
					this.tableroActualM(this.$route.params.id)
				})
				this.password = ''
				this.passwordRepeat = ''
			} catch (e) {
				console.log('lockTableroActual error: '+e);
			}
		},
		async disablePasswordTemporalTablero(){
			try {
				if (this.tableroActual.lock.disableTime == undefined) {
					this.tableroActual.lock.disableTime = ''
				}
				if (this.timeDisablePassword != this.tableroActual.lock.disableTime) {

					if (this.disablePasswordTemporal) {
						await axios.post(`${UrlApp}edit/tablero/${this.tableroActual._id}`,{
							state: false, lock:{ state: false, 					 password:this.tableroActual.lock.password,
								disableTime: this.timeDisablePassword }
						})
					}else{
						await axios.post(`${UrlApp}edit/tablero/${this.tableroActual._id}`,{
							state: true, lock:{ state: true, password:this.tableroActual.lock.password }
						})
					}
					this.$nextTick(function() {
						this.tableroActualM(this.$route.params.id)
					})
				}

			} catch (e) {
				console.log('disablePasswordTemporalTablero error: '+e);
			}
		},
		async changePaswordTablero(){
			try {
				await axios.post(`${UrlApp}lock/tablero/${this.$route.params.id}`, {
					lock:{ password: this.password, disableTime:this.tableroActual.lock.disableTime }
				})
				this.$nextTick(function() {
					this.tableroActualM(this.$route.params.id)
				})
			} catch (e) {
				console.log('changePaswordTablero error: '+e);
			}
		},
		async changePasswordAccept(){
            try {
				if (this.passwordAccept !='' || null || undefined){
					let resp = await axios.post(`${UrlApp}unlock/tablero/${this.$route.params.id}`,{ password: this.passwordAccept })
					if (resp.data) {
						if (this.updatePassword) {
							this.changePaswordTablero()
							this.disablePasswordTemporalTablero()
						}else if (this.deletePassword) {
							this.deletePasswordLockTablero()
						}
						this.optionsLockAndUnlockDialog = false
						this.acceptPasswordDialog = false
						this.updatePassword = false
						this.drawerRight = false
						this.clearPasswordError()
						this.passwordAccept = ''
						this.passwordRepeat = ''
						this.password = ''

					} else this.chengePasswordError('La contraseña no coincide')
				} else this.chengePasswordError('Coloque una contraseña')

            } catch (e) {
                console.log(`changePasswordAccept error: ${e}`)
            }
        },
		accept(){
			if (this.updatePassword) {
				if(this.password =='' || this.passwordRepeat=='') {
					this.msjError = 'No pueden haber campos vacios'
				}else if(this.password != this.passwordRepeat) {
					this.msjError = 'Las contraseñas no coinsiden'
				}else if (this.password != this.passwordRepeat && this.password.length < 4 || this.passwordRepeat.length < 4) {
					this.msjError = 'No pueden haber menos de 4 digitos'
				}else {
					this.acceptPasswordDialog = true
					this.msjError = ''
				}
			}else if (this.deletePassword) {
				this.acceptPasswordDialog = true
				this.msjError = ''
			}else{
				this.drawerRight = false
				this.acceptPasswordDialog = false
				this.disablePasswordTemporalTablero()
				this.optionsLockAndUnlockDialog = false
				this.updatePassword = false
				this.deletePassword = false
			}
		},
		decline(){
			this.drawerRight = false
			this.updatePassword = false
			this.deletePassword = false
			this.acceptPasswordDialog = false
			this.optionsLockAndUnlockDialog = false
			this.$nextTick(function () {
				this.tableroActualM(this.$route.params.id)
			})
		},
		selectListDelete(item, itemId){
			if (!this.selectDeleteState) {
				this.listVisualTask = true
				this.listVisualOneComponent = item
			}else {
				this.selectList.includes(itemId) ?
					this.selectList.splice(itemId, 1) : this.selectList.push(itemId)
			}
		},
		revers(){
			this.deleteItems_.reverse()
			this.orderSub = !this.orderSub
		},
		cancelSelectDelete(){
			this.listVisualTask = false
			this.selectDeleteState= false
			this.selectList=[]
		},
		async deleteListPapeleraAll(){
			try {
				let selectList = []
				this.deleteItems_.forEach((item) => {
					selectList.push(item._id)
				})
				let resp = await axios.post(`${UrlApp}lista/delete/many`, selectList)
				if (resp.data.deletedCount > 0) {
					this.deleteAllListaM()
				}

			} catch (e) {
				console.log('deleteListPapeleraAll error: '+e);
			}
		},
		async deleteListPapeleraSelect(){
			try {
				if (this.selectList != '') {
					let resp = await axios.post(`${UrlApp}lista/delete/many`, this.selectList)
					if (resp.data) this.allListaTablerosDeleteTrueM()
					this.selectList = []
				}
			} catch (e) {
				console.log('deleteListPapeleraSelect error: '+e);
			}
		},
		async deleteListPapeleraOne(){
			try {
				let id = this.listVisualOneComponent._id
				let resp = await axios.post(`${UrlApp}lista/delete/many`,[id])
				if (resp.data) this.allListaTablerosDeleteTrueM()
				setTimeout(()=> { this.listVisualTask = false }, 200);
			} catch (e) {
				console.log('deleteListPapeleraOne error: '+e);
			}
		},
	},
	watch: {
		$route(to, from){
			this.pathActual = to.path
			this.tableroActualM(this.$route.params.id)
		},
		lockTableroTrueDialog(){
		   	this.password = ''
		   	this.clearPasswordError()
	   	},
		disablePasswordTemporal(value, oldvalue){
			if (value) {
				if (this.timeDisablePassword != '') this.timeDisablePassword
				else this.timeDisablePassword = 't'
			}
			else this.timeDisablePassword = ''
		}
	},
	mounted() {
		this.allTablerosM()
		this.allListaTablerosDeleteTrueM()
		this.pathActual = this.$route.path
		this.tableroActualM(this.$route.params.id)
	},
}
</script>

<style>
	.q-btn-revers{
		margin-left:10px;
	}
	.q-btn-revers .q-btn__wrapper{
		padding-left: 7px;
    	padding-right: 7px;
	}
	.task.task_delete{
		width: 280px !important;
    	min-height: 16vh !important;
	}
	.task.task_delete_expand{
		width: 460px !important;
	}
	.q-check-modif{
		display: block;
		float: right;
		margin-bottom: -40px;
		position: relative;
	    top: 0px;
	}
 	.deleteLista .q-icon.q-btn-dropdown__arrow{
 		display: none;
 	}
	.q-input-password {
		max-width: 280px;
    	display: inline-block;
	},
	.disableTimePassword .q-radio {
	    margin-right: 10px;
	}
	.disableTimePassword.q-item {
	    padding: 8px 12px;
	}
	.mr-10{
		margin-right: 10px;
	}
	.seccion-papelera{
		display: flex;
	    flex-flow: wrap;
	}
	.papelera{
		position: absolute;
		bottom: 0px;
		display: flex;
		width: 100%;
	}
	.active_{
		background-color: #e3e3e3 !important;
	}
	.title-principal {
		cursor: pointer;
		text-decoration: none;
		color: #e3e3e3;
	}
	.title-tablero{
		cursor: pointer;
	}
	.h5-taberos{
		margin: 2px;
	}
	.q-list {
		text-align: center;
		color: #68007c;
	}
	.q-item__label--header {
		text-align: left;
	}
	.q-item {
		text-align: left;
	}
	.barra{
		background-color: #68007c;
	}
	.menu-lateral{
		background-color: #c8d2d3;
	}
</style>
