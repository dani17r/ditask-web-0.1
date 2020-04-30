import VueRouter from "vue-router"
import {middleware} from "vue-router-middleware"

const routes = [
	{
		path: "/",
		redirect: "/dashboard"
	},
	{
		path: "/dashboard",
		component: () => import("layouts/main"),
		children: [
			{
				path: "/",
				name: "dashboard",
				component: () => import("pages/dashboard")
			},
			...middleware("id-tablero-exist", [
				{
					path: "/tablero/:id",
					component: () => import("pages/tablero")
				}
			]),
		]
	},
	{
	    path: '/ejemplo',
	    component: () => import('pages/ejemplo')
	}
]

if (process.env.MODE !== "ssr") {
	routes.push({
		path: "*",
		component: () => import("pages/Error404.vue")
	})
}

export default routes
