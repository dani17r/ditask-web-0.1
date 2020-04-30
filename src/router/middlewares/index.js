import { createMiddleware } from 'vue-router-middleware'
import axios from 'axios'

createMiddleware('id-tablero-exist', async (args, to, from, next) => {
    let id = to.params.id
    let res = await axios.get(UrlApp+'detall/tablero/'+id)
    if (res.data != null) {
        if (res.data._id == id){
            if (res.data.lock.state) {
                if (res.data.state) await next()
                else await next('/')
            } else await next()
        } else await next('/')
    } else next('/')
})

createMiddleware('is-login', async (args, to, from, next) => {
    function isLogin(){ return false }
    if (isLogin()) {
        next()
    }else{
        next('/login')
    }
})
