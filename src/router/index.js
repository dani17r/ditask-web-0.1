import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import middlewares from './middlewares'
import VueRouterMiddleware from 'vue-router-middleware'

Vue.use(VueRouter)

export default function (/*store, ssrContext*/) {
    const router = new VueRouter({
        scrollBehavior: () => ({ x: 0, y: 0 }),
        routes,
        mode: 'history',
        // base: 'http://localhost:8080/'
    })

    Vue.use(VueRouterMiddleware, { router })
    window._$router = router
    return router
}
