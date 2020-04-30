export default {
    namespaced: true,
    state:{
        itemsDeleteTrue:[],
    },
    mutations:{
        async allListaTablerosDeleteTrueM(state){
			try {
				let resp = await axios.get(UrlApp+'lista/all/?where_[delete]=true')
				if (resp.data !='' || null || [] || undefined){
					state.itemsDeleteTrue = resp.data
				} else { state.itemsDeleteTrue = [] }
			} catch (e) {
				console.log('alllistaTableros error: -- : '+e)
			}
		},
        deleteAllListaM(state){
            state.itemsDeleteTrue = []
		},
        deleteOneAllListaM(state, id){
            state.itemsDeleteTrue.splice(id, 1)
		},
    },
    actions:{

    },
    getters:{

    },
}
