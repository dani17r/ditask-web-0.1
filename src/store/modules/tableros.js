import axios from 'axios'
export default {
    namespaced: true,
    state:{
        leftDrawerOpen: false,
        tableros:[],
        tableroActual:[],
        tableroActual_:[],
        lockTableroTrueDialog:false,
        passwordError:null,
    },
    mutations:{
        async newTableroM(state, body){
            try {
                let resp = await axios.post(UrlApp+'add/tablero', body)
                state.tableros.push(resp.data)
            } catch (e) {
                console.log(e)
            }
        },
        async allTablerosM(state){
            try {
                const resp = await axios.get(UrlApp+'all/tableros')
                state.tableros = resp.data
            } catch (e) {
                console.log(e)
            }
        },
        async tableroActualM(state, id){
            try {
                let resp = await axios.get(UrlApp+'detall/tablero/'+id)
                if (resp.data !='' || null || [] || undefined) {
                    state.tableroActual = resp.data
                    state.tableroActual_ = resp.data
                }else{
                    state.tableroActual = []
                    state.tableroActual_ = []
                }
            } catch (e) {
                console.log('tableroActual error: -- : '+e)
            }
        },
        async stateLockAndUnlockM(_state, data){
            try {
                if (data.tableroActual.lock.state) {
                    await axios.post(`${UrlApp}lock/tablero/${data.tableroActual._id}`,{
                        state:data.state_
                    })
                }
            } catch (e) {
                console.log('stateLockAndUnlockM error: '+e);
            }
        },
        async abrirTableroM(state, id_tablero){
            try {
                let resp = await axios.get(`${UrlApp}detall/tablero/${id_tablero}`)
                    let arr
                    if (resp.data.lock.password !=undefined || '' || null)
                        arr = { _id: resp.data._id, lock: { password: resp.data.lock.password, disableTime: resp.data.lock.disableTime } }
                    else arr = { _id: resp.data._id }
                    state.tableroActual = arr

                if (resp.data.lock.state) {
                    if (window.location.href != `${UrlOrigin}tablero/${id_tablero}`)
                        state.lockTableroTrueDialog = true
                } else {
                    if (window.location.href != `${UrlOrigin}tablero/${id_tablero}`)
                        _$router.push(`/tablero/${id_tablero}`)
                }
            } catch (e) {
                console.log(`abrirTablero error: ${e}`)
            }
        },
        lockTableroTrueDialogM(state, state_){
            state.lockTableroTrueDialog = state_
        },
        cancelUnlockTableroM(state){
            state.lockTableroTrueDialog = false
            state.tableroActual = []
        },
        ClearUnlockTableroM(state){
            state.tableroActual = []
        },
        clearPasswordError(state){
            state.passwordError = ''
        },
        chengePasswordError(state, data){
            state.passwordError = data
            setTimeout(function () {
                state.passwordError = ''
            }, 3000);
        },
    },
    actions:{
        async unlockTableroA({state, commit}, data){
                try {
                    if(data.password !='' || null || undefined){
                        let resp = await axios.post(`${UrlApp}unlock/tablero/${data.tableroActual._id}`,{ password:data.password })

                        if (resp.data) {
                            commit('stateLockAndUnlockM',{
                                tableroActual:data.tableroActual,
                                state_:true
                            })
                            setTimeout(function () {
                                commit('lockTableroTrueDialogM', false)
                                _$router.push(`/tablero/${data.tableroActual._id}`)
                                commit('ClearUnlockTableroM')
                            }, 300);
                        } else state.passwordError = 'La contraseña no coincide'
                    } else state.passwordError = 'Coloque una contraseña'

                } catch (e) {
                    console.log('unlockTableroA error: '+e);
                }
        },
    },
    getters:{

    },
}
