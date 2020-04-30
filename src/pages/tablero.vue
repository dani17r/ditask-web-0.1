<template>
<div class="mt-2 m-5">
	<div :class="disable == false ? 'fixed-oscuro' : ''"></div>

	<q-breadcrumbs class="m-15">
		<q-breadcrumbs-el label="Inicio" />
		<q-breadcrumbs-el label="tablero" />
		<q-breadcrumbs-el :label="tableroActual_.name" />
	</q-breadcrumbs>

	<!-- v-dragscroll -->
	<draggable v-model="items" class="row unset" tag="div">

		<div class="col-3 task m-5" v-for="(item, index) in noDeleteItems_" :key="index+1" :style="'background-color:'+item.color.bg" :class="item.disable == false ? 'oscureser' : ''">

			<q-btn-dropdown class="btn-options" :style="'color:'+item.color.tx" flat fab-mini icon="more_vert">
				<q-list>
					<q-item clickable v-close-popup @click="papeleraItem(item,index)">
						<q-item-section>
							<q-item-label>Enviar a papelera</q-item-label>
						</q-item-section>
					</q-item>

					<q-item clickable v-close-popup>
						<q-item-section>
							<q-item-label>Bloquear</q-item-label>
						</q-item-section>
					</q-item>

					<q-item clickable v-close-popup @click="deleteListPapeleraOne(item._id)">
						<q-item-section>
							<q-item-label>eliminar</q-item-label>
						</q-item-section>
					</q-item>

				</q-list>
			</q-btn-dropdown>

			<q-btn icon="colorize" :style="'color:'+item.color.tx" class="cursor-pointer colorize-modif" flat round size="xs">
				<q-menu transition-show="flip-right" transition-hide="flip-left">
					<q-list dense style="min-width: 100px">

						<q-item clickable name="colorize-1">
							<q-item-section>fondo</q-item-section>
							<q-popup-proxy transition-show="scale" transition-hide="scale">
								<q-color v-model="item.color.bg" @change="color_bg(item._id, item.color.bg, item.color.tx)" class="my-picker" default-view="palette" no-header no-footer />
							</q-popup-proxy>
						</q-item>

						<q-item clickable name="colorize-2">
							<q-item-section>texto</q-item-section>
							<q-popup-proxy transition-show="scale" transition-hide="scale">
								<q-color v-model="item.color.tx" @change="color_tx(item._id, item.color.tx, item.color.bg)" class="my-picker" default-view="palette" no-header no-footer />
							</q-popup-proxy>
						</q-item>

						<q-item clickable @click="resetColor(item)" v-show="item.color.tx != '#696969' || item.color.bg != '#f3f3f3'">
							<q-item-section>Reset</q-item-section>
						</q-item>
					</q-list>
				</q-menu>
			</q-btn>

			<span class="tittle-tablero" :style="item.disable == false ? 'border-color:'+item.color.tx+'; background-color:'+item.color.bg : 'border-color:'+item.color.tx" @dblclick="editNameItemAction(item)"
				v-tooltip="'doble click para editar'" :class="item.disable == false ? 'oscureser-span': ''">

				<input :class="['new-tarea', item._id]"
					:style="item.disable == false ? 'color:'+item.color.tx : 'color:'+item.color.tx" @keyup.enter="nameListEdit($event, item)"
					@blur="[disable=true, nameListEdit($event, item)]"
					:disabled="item.disable"
					:value.lazy="item.name" type="text">
			</span>

			<input class="new-tarea" @keyup.enter="addTask($event, item.list, item._id)" @blur="addTask($event, item.list, item._id)" :style="'color:'+item.color.tx" placeholder="add something" type="text">

			<draggable :list="item.list" draggable=".item" group="a" @change="actionsMoviment($event, item._id)">
				<span class="item item-tasks" v-for="task in item.list" :key="task._id"
					:style="item.disable == false ? 'background-color:#f3f3f359':''"
					@click="optionesDialogActions($event, task, item)">
						{{ task.title }}
				</span>
			</draggable>
		</div>
	</draggable>

	<q-btn @click="NewListDialog = true" icon="note_add" class="btn-addlist m-5" key="555" />

	<q-dialog v-model="NewListDialog">
		<q-card style="min-width: 350px">
			<q-card-section>
				<q-input dense v-model="newName" autofocus placeholder="titulo" @keyup.enter="addlist(items)" />
			</q-card-section>
			<q-card-actions align="right" class="text-primary">
				<q-btn flat label="Cancel" v-close-popup />
				<q-btn flat label="crear" v-close-popup @click="addlist(items)" />
			</q-card-actions>
		</q-card>
	</q-dialog>

	<q-dialog v-model="optionsSubListDialog" full-width class="optionsSubListDialog">
		<q-card>
			<q-card-section class="row">
				<div class="col-11">
					<div class="" v-show="!editNameSubListDialog">
						<div class="text-h6" style="padding: 8px;" @dblclick="editNameSubList()">
							{{taskActual.title}}
							<q-icon name="edit" @click="editNameSubList()" style="cursor:pointer;"/>
						</div>
						<q-separator inset />
					</div>
					<q-input v-model="taskActual.title" class="text-h6 inputEditNameSubList" v-show="editNameSubListDialog" @blur.blurSaveNameSubList="saveNameSubList()">
						<template v-slot:append>
							<q-icon name="saves" color="primary" @click="saveNameSubList(), blurSaveNameSubList = false" />
							<q-icon name="cancel" color="red" @click="cancelNameSubList()" />
						</template>
					</q-input>
				</div>
				<div class="col-1">
					<q-btn color="primary" icon="more_vert" unelevated round style="float: right;">
						<q-menu fit anchor="top left" self="top right">
							<q-list dense style="min-width: 100px">
								<q-item clickable v-close-popup>
									<q-item-section>Bloquear</q-item-section>
								</q-item>
								<q-separator />

								<q-item dense clickable>
									<q-item-section>Enviar a</q-item-section>
									<q-item-section side>
										<q-icon name="keyboard_arrow_right" />
									</q-item-section>

									<q-menu auto-close anchor="top right" self="top left">
										<q-list>
											<q-item dense clickable>
												<q-item-section>3rd level Label</q-item-section>
											</q-item>
										</q-list>
									</q-menu>
								</q-item>

								<q-separator />
								<q-item clickable v-close-popup>
									<q-item-section @click="deleteSubListaAction()">Eliminar</q-item-section>
								</q-item>
							</q-list>
						</q-menu>
					</q-btn>
				</div>

			</q-card-section>

			<q-card-section class="q-pt-none row">
				<div class="descripcion col-6 q-pa-md">
					<div class="" v-if="!editionDescription && taskActual.description == ''">
						<div @click="editionDescriptionAction()" class="text inline-modif">
							<q-icon name="add" /> Agregar descripción
						</div>
					</div>
					<div v-else>
						<div v-show="!editionDescription">
							<p @dblclick="editionDescriptionAction()" ref="q_html_render"
								v-html="taskActual.description">
							</p>
							<div @click="editionDescriptionAction(), descripcionFreeze = taskActual.description" class="text inline-modif">
								<q-icon name="edit" /> Editar descripción
							</div>
						</div>
					</div>
					<div class="" v-show="editionDescription">
						<q-editor v-model="taskActual.description" :value="descripcionFreeze" flat
							:toolbar="[
								['left', 'center', 'right', 'justify'],
								['bold', 'italic', 'strike', 'underline'],
								['unordered', 'ordered'],
								[
									{
										icon: $q.iconSet.editor.fontSize,
										fixedLabel: true,
										fixedIcon: true,
										list: 'no-icons',
										options: ['size-1', 'size-2', 'size-3',
										'size-4', 'size-5']
									}
								],
							]" />
							<div class="q-editor-action">
								<q-btn class="q-btn-save"
									flat unelevated icon="save"
									size="12px" dense label="Guardar" @click="saveDescriptionSubList()"/>
								<q-btn class="q-btn-cancel"
									flat unelevated icon="cancel"
									size="12px" dense label="Cancelar" @click="cancelDescriptionSubList()"/>
							</div>
					</div>
				</div>
				<div class="etiquetas col-6 q-pr-md q-pl-md">
					<q-select label="Agregar etiqueta"
						hide-dropdown-icon v-model="modelMultiple"
						use-input use-chips multiple
						input-debounce="0"
						@new-value="createTag"
						:options="filterOptions"
						@filter="tagsShow"
						@add="addTag"
						@clear ="clearTags"
						@remove ="removedTag"
						clearable counter
						:hide-selected="false"
						options-dense/>
				</div>
			</q-card-section>

			<q-card-actions align="right" class="bg-white text-teal">
				<!-- <q-btn flat label="OK" v-close-popup /> -->
			</q-card-actions>
		</q-card>
	</q-dialog>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex"
import draggable from "vuedraggable"
import { dragscroll } from 'vue-dragscroll'
let stringOptions = []
export default {
	name: "example",
	components: {
		draggable
	},
	directives: {
		'dragscroll': dragscroll
	},
	data() {
		return {
			editNameSubListDialog: false,
			blurSaveNameSubList: true,
			optionsSubListDialog: false,
			editionDescription: false,
			NewListDialog: false,
			offScroll: true,
			disable: true,

			idListaActualRemove: '',
			listaNoDeleteCount: '',
			descripcionFreeze: '',
			idListaActual: '',
			taskActual: '',
			newName: '',

			tableroActual: [],
			itemsOrigin: [],
			items: [],

			filterOptions: stringOptions,
			modelMultiple: null,
			id: 1,
		}
	},
	computed: {
		...mapState( 'tableros', [ 'tableroActual_' ] ),
		noDeleteItems_() {
			return this.items.filter( a => a.delete == false )
		},
		lists() {
			return this.items
		},
		subLists() {
			return this.lists.map( item => {
				return { _id: item._id, list: item.list }
			} )
		},
	},
	watch: {
		$route( to, from ) {
			this.allListaForId()
			this.tableroActualL( this.$route.params.id )
		},
		lists( value, oldValue ) {
			var AutoIndex = 1
			if ( oldValue != '' ) {
				value.forEach( ( item ) => {
					if ( item.delete == false ) {
						axios.post(`${UrlApp}lista/edit/${item._id}`, { _index: (AutoIndex++) }).then()
					}
				} )
			}
		},
		subLists( value, oldValue ) {
			if ( oldValue != '' ) {
				value.forEach( ( item, _i ) => {
					const lista = value[ _i ]
					setTimeout( () => {
						for ( var i = 0; i < lista.list.length; i++ ) {
							if ( lista._id == this.idListaActual || lista._id == this.idListaActualRemove ) {
								let url_ = `${this.idListaActual}/${lista.list[i]._id}`
								axios.post( `${UrlApp}sublista/edit-task/${url_}`, { "list.$._index": i + 1 } ).then()
							}
						}
					}, 10 )
				} )
			}
		},
	},
	methods: {
		...mapMutations( "listas", [ "allListaTablerosDeleteTrueM" ] ),
		...mapMutations( "tableros", [ 'stateLockAndUnlockM', 'cancelUnlockTableroM',
			'tableroActualM',
		] ),
		cancelNameSubList(){
			if (this.taskActual.title != this.taskActual.NameEvent) {
				this.taskActual.title = this.taskActual.NameEvent}
			this.editNameSubListDialog = false
		},
		cancelDescriptionSubList(){
			if (this.taskActual.description != this.descripcionFreeze){
				this.taskActual.description = this.descripcionFreeze}
			this.editionDescription = false
		},
		editNameSubList(){
			this.editNameSubListDialog = true
			setTimeout(()=> {
				$('.inputEditNameSubList input').focus()
			}, 300)
		},
		editionDescriptionAction(){
			this.editionDescription = true
			setTimeout(()=> {
				$('.q-editor__content').focus()
			}, 300);
		},
		editNameItemAction(item){
			this.disable = false
			item.disable = false
			setTimeout(()=> {
				$('.'+item._id).focus()
			}, 300);
		},
		optionesDialogActions(events, task, item) {
			this.modelMultiple = []
			this.optionsSubListDialog = true
			this.editionDescription = false
			this.editNameSubListDialog = false
			this.taskActual = task
			this.idListaActual = item._id
			this.taskActual.NameEvent = events.toElement.innerText
			this.allTagsTask(task._id)
		},
		async addTag(val){
			try {
				let respOne = await axios.get(`${UrlApp}tag/detail/task/${this.$route.params.id}/${val.value}`)
				let id_tag = respOne.data[0]._id
				let url_ = `${UrlApp}sublista/sub/edit/${this.tableroActual._id}/${this.taskActual._id}`
				let respTwo = await axios.post(`${url_}`, {'list.$.tags': { index:1, id_tag, color:"" }})
				if (respTwo.status == 200) {
					this.allTags()
				}
			} catch (e) {
				console.log('addTag error: '+e);
			}
		},
		removedTag(val){
			console.log(val);
		},
		clearTags(val){
			console.log(val);
		},
		async createTag( val, done ) {
			if ( !stringOptions.includes(val) ) {
				try {
					let resp = await axios.post(`${UrlApp}tag/add`,{
						title:val, id_tablero:this.$route.params.id
					})
					stringOptions.push(val)
					done( val, 'toggle','add-unique')
				} catch (e) {
					console.log('createValue error: '+e);
				}
			}
		},
		async allTags(){
			try {
				let resp = await axios.get(`${UrlApp}tags/all`)
				let filterIdTablero = resp.data.filter(a =>{ return a.id_tablero == this.$route.params.id })
				stringOptions = filterIdTablero.map(a =>{ return a.title })
			} catch (e) {
				console.log('allTags error: '+e)
			}
		},
		async allTagsTask(taskActualId){
			try {
				let resp = await axios.get(`${UrlApp}sublista/tags/${taskActualId}`)
				if (resp != '') {
					let vm = this
					let titleTagsTask = (resp.data || []).map(async (a)=>{
						if (a !='' || null || undefined) {
							let respTwo = await axios.get(`${UrlApp}tag/detail/${a.id_tag}/${vm.$route.params.id}`)
							this.modelMultiple.push(respTwo.data[0].title)
						}else{
							return []
						}
					})
				}
			} catch (e) {
				console.log('allTags error: '+e)
			}
		},
		tagsShow( val, update ) {
			update( () => {
				if ( val === '' ) {
					this.filterOptions = stringOptions
				} else {
					this.filterOptions = stringOptions.filter(
						a => a.toLowerCase().indexOf( val.toLowerCase() ) > -1
					)
				}
			} )
		},
		async deleteSubListaAction(){
			try {
				let url_ = `${UrlApp}sublista/removed/${this.idListaActual}/${this.taskActual._id}`
				let resp = await axios.post(`${url_}`, { "list.$.title": this.taskActual.title} )
				this.optionsSubListDialog = false
				this.$nextTick( function () {
					this.allListaForId()
				})
			} catch (e) {
				console.log('deleteSubListaAction error:'+e);
			}
		},
		async saveNameSubList(){
			try {
				let url_ = `${UrlApp}sublista/edit/${this.tableroActual._id}/${this.taskActual._id}`

				if (this.taskActual.title == '' || this.taskActual.title == this.taskActual.NameEvent) {
					this.editNameSubListDialog = false
					this.taskActual.title = this.taskActual.NameEvent
				}else{
					if (this.taskActual.title != this.taskActual.NameEvent) {
						let resp = await axios.post(`${url_}`, { "list.$.title": this.taskActual.title} )
						this.editNameSubListDialog = false
						if (resp.status == 200) this.taskActual.NameEvent = this.taskActual.title
					}
				}
			} catch (e) {
				console.log('saveNameSubList: '+e);
			} finally{
				this.blurSaveNameSubList = true
			}
		},
		async saveDescriptionSubList(){
			try {
				let url_ = `${UrlApp}sublista/edit/${this.tableroActual._id}/${this.taskActual._id}`
				if (this.taskActual.descripcion == '' || this.taskActual.description == this.descripcionFreeze) {
					this.editionDescription = false
					this.descripcionFreeze = this.taskActual.description
				}else{
					if (this.taskActual.description != this.taskActual.NameEvent) {
						let resp = await axios.post(`${url_}`, { "list.$.description": this.taskActual.description} )
						this.editionDescription = false
						if (resp.status == 200) this.descripcionFreeze = this.taskActual.description
						console.log(resp);
					}
				}
			} catch (e) {
				console.log('saveDescriptionSubList: '+e);
			}
		},
		async actionsMoviment( events, _id ) {
			try {
				if ( events.added ) {
					this.idListaActualRemove = ''
					this.idListaActual = _id
					let resp = await axios.post( `${UrlApp}sublista/add/${_id}/${this.$route.params.id}`, events.added.element )
				} else if ( events.removed ) {
					this.idListaActualRemove = _id
					let resp = await axios.post( `${UrlApp}sublista/removed/${_id}/${events.removed.element._id}` )
				} else if ( events.moved ) {
					this.idListaActualRemove = ''
					this.idListaActual = _id
				}
			} catch ( e ) {
				console.log( 'actionsMoviment added error:' + e );
			}
		},
		async allListaForId() {
			try {
				let resp = await axios.get(UrlApp+'lista/detall/'+this.$route.params.id)
				if ( resp.data != '' || null || [] || undefined ) {
					this.items = resp.data
					this.itemsOrigin = resp.data
				} else {
					this.items = []
					this.itemsOrigin = []
				}
			} catch ( e ) {
				console.log( 'allTableForId error: -- : ' + e )
			}
		},
		async tableroActualL( id ) {
			try {
				let resp = await axios.get( UrlApp + 'detall/tablero/' + id )
				if ( resp.data != '' || null || [] || undefined ) this.tableroActual = resp.data
				else this.tableroActual = []
			} catch ( e ) {
				console.log( 'tableroActual error: -- : ' + e )
			}
		},
		async countNoDeleteLista() {
			try {
				let resp = await axios.get( UrlApp + 'lista/count/' + this.$route.params.id + '?where=false' )
				if ( resp.data != '' || null || [] || undefined ) {
					this.listaNoDeleteCount = resp.data
				} else {
					this.listaNoDeleteCount = ''
				}
			} catch ( e ) {
				console.log( 'countNoDeleteLista error: ' + e );
			}
		},
		async addTask( event, lists, _id ) {
			try {
				if ( event.target.value != '' ) {
					let resp = await axios.post( `${UrlApp}sublista/add/${_id}/${this.$route.params.id}`, {
						_index: lists.length + 1,
						title: event.target.value,
						description: '',
					} )
					lists.push( resp.data[ 0 ] )
					event.target.value = ''
				} else {
					event.target.value
				}
			} catch ( e ) {
				console.log( 'addTask: ---- :' + e );
			}
		},
		async addlist( items ) {
			try {
				let newlist = await axios.post(`${UrlApp}lista/add`, {
					id_tablero: this.$route.params.id,
					_index: this.listaNoDeleteCount++,
					name: this.newName,
					list: []
				} )
				this.newName = ''
				this.$nextTick( function () {
					this.countNoDeleteLista()
					this.allListaForId()
				} )
			} catch ( e ) {
				console.log( 'hubo un error: -- :' + e );
			} finally {
				this.itemsOrigin.forEach((it) => {
					if ( it.delete == true ) {
						axios.post(`${UrlApp}lista/edit/${it._id}`, {
							_index: ( (this.listaNoDeleteCount++)+1 )
						}).then()
					}
				} )
			}
		},
		async nameListEdit( event, list ) {
			list.disable = true
			if ( list.name != event.target.value ) {
				if ( event.target.value != '' ) {
					list.name = event.target.value
					let resp = await axios.post( UrlApp + 'lista/edit/' + list._id, {
						name: event.target.value
					} )
				}
			}
		},
		async papeleraItem( item, index ) {
			try {
				item.delete = true
				await axios.post( UrlApp + 'lista/edit/' + item._id, { delete: true } )
				this.$nextTick( function () { this.countNoDeleteLista() } )
			} catch ( e ) {
				console.log( 'papeleraItem: --- :' + e )
			} finally {
				this.itemsOrigin.forEach( ( item_, index ) => {
					if ( item_.delete == true ) {
						axios.post( UrlApp + 'lista/edit/' + item_._id, { _index: this.listaNoDeleteCount++ } )
					}
				} )
				this.noDeleteItems_.forEach( ( _item, index ) => {
					if ( _item.delete == false ) {
						axios.post( UrlApp + 'lista/edit/' + _item._id, { _index: index + 1 } )
					}
				} )
				this.$nextTick( function () {
					this.allListaTablerosDeleteTrueM()
				} )
			}
		},
		async color_tx( _id, color_tx, color_bg ) {
			try {
				await axios.post( UrlApp + 'lista/edit/' + _id, {
					color: { tx: color_tx, bg: color_bg }
				} )
			} catch ( e ) {
				console.log( 'error color_tx: ' + e );
			}
		},
		async color_bg( _id, color_bg, color_tx ) {
			try {
				await axios.post( UrlApp + 'lista/edit/' + _id, {
					color: { tx: color_tx, bg: color_bg }
				} )
			} catch ( e ) {
				console.log( 'error color_bg: ' + e );
			}
		},
		async resetColor( item ) {
			try {
				if ( item.color.tx != '#696969' || item.color.bg != '#f3f3f3' ) {
					await axios.post( UrlApp + 'lista/edit/' + item._id, {
						color: { tx: '#696969', bg: '#f3f3f3' }
					} )
					item.color.tx = '#696969'
					item.color.bg = '#f3f3f3'
				}
			} catch ( e ) {
				console.log( 'error color_bg: ' + e );
			}
		},
		async deleteListPapeleraOne( id ) {
			try {
				let resp = await axios.post( `${UrlApp}lista/delete/many`, [ id ] )
				if ( resp.data ) {
					this.$nextTick( function () {
						this.countNoDeleteLista()
						this.allListaForId()
					} )
				}
			} catch ( e ) {

			}
		},
	},
	mounted() {
		this.allListaForId()
		this.tableroActualM(this.$route.params.id )
		this.tableroActualL(this.$route.params.id )
		this.countNoDeleteLista()
		this.allTags()
	},
	beforeRouteUpdate( to, from, next ) {
		this.stateLockAndUnlockM( { tableroActual: this.tableroActual, state_: false } )
		this.cancelUnlockTableroM()
		this.allTags()
		next()
	},
	beforeRouteLeave( to, from, next ) {
		this.stateLockAndUnlockM( { tableroActual: this.tableroActual, state_: false } )
		this.cancelUnlockTableroM()
		next()
	}
}
</script>

<style>
.q-item.q-item--active {
	display: none;
}
.q-editor-action{
	margin-top: 8px;
}
.q-editor-action i.on-left{
	margin-right: 0px;
}
.q-editor-action .q-btn-save{
	margin-right: 21px;
}
.etiquetas .q-field__control:before {
	border-bottom: 0px !important;
}
.etiquetas .q-field--auto-height.q-field--labeled .q-field__control-container {
	padding-top: 30px !important;
}
.descripcion .q-field__control-container {
	padding-top: 30px !important;
}
.descripcion .q-editor__content {
	border-bottom: 1px solid #8080806e !important;
	min-height: 3rem !important;
}

.inline-modif {
	display: inline !important;
	cursor: pointer;
}

.fixed-oscuro {
	width: 100%;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 3000;
	background: rgba(0, 0, 0, 0.4);
}

.oscureser {
	z-index: 5000 !important;
	background-color: transparent !important;
}

.oscureser-span {
	/* background-color: inherit; */
	border-radius: 5px 5px 0px 0px;
	width: 100% !important;
	padding: 9px 25px !important;
}

.colorize-modif {
	float: left;
	display: inline-flex;
	margin-bottom: -40px;
	font-size: 11px !important;
}

/* **************************************** */
.unset {
	flex-wrap: unset !important;
	overflow: auto;
	height: 82vh;
	scrollbar-color: rgba(0, 0, 0, .5) rgba(0, 0, 0, 0);
	scrollbar-width: thin;
}

.unset::-webkit-scrollbar {
	-webkit-appearance: none;
}

.unset::-webkit-scrollbar:vertical {
	width: 10px;
}

.unset::-webkit-scrollbar-button:increment,
.unset::-webkit-scrollbar-button {
	display: none;
}

.unset::-webkit-scrollbar:horizontal {
	height: 10px;
}

.unset::-webkit-scrollbar-thumb {
	background-color: #797979;
	border-radius: 20px;
	border: 2px solid #f1f2f3;
}

.unset::-webkit-scrollbar-track {
	border-radius: 10px;
}

/* **************************************** */
.btn-options {
	float: right;
	margin-bottom: -40px;
}

.btn-options .material-icons.q-icon.q-btn-dropdown__arrow.q-btn-dropdown__arrow-container {
	display: none !important;
}

.m-5 {
	margin: 5px;
}

.m-15 {
	margin: 15px;
}

.mt-2 {
	margin-top: 20px;
}

.tittle-tablero {
	display: inline-block;
	width: 90%;
	padding: 9px 0px;
	text-align: center;
	color: #696969;
	border-bottom: 1px solid #acacac;
	cursor: pointer;
}

.new-tarea {
	width: 90%;
	border: 0px;
	margin-top: 9px;
	padding-right: 15px;
	margin-bottom: 9px;
	background: #a2454500;
	opacity: .6 !important;
	cursor: pointer;
}

.new-tarea:focus {
	outline: #e0e0e0 0px;
}

.new-tarea::placeholder {
	color: inherit;
	opacity: .6 !important;
}

.new-tarea[disabled] {
	cursor: text !important;
}

.item-tasks {
	text-align: left;
	display: block;
	width: 100%;
	-webkit-text-orientation: upright;
	text-orientation: upright;
	background-color: #f3f3f3;
	margin: 9px 0px;
	padding: 8px 15px;
	box-shadow: 0px 2px 9px -7px;
}

.task {
	width: 320px !important;
	height: 100%;
	min-height: 20vh;
	border-radius: 5px;
	text-align: center;
	height: fit-content !important;
}

.btn-addlist {
	background-color: rgb(195, 153, 203);
	color: white;
	position: absolute;
	right: 10px;
	top: 65px;
}
</style>
