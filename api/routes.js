const router = require('express').Router()
const { urlAccess } = require('./config')
const rts = require('./routes/main')
const app = require('express')()
const cors = require('cors')

router.get('/', rts.inicio)

// rutas de tableros - tablero
router.get('/detall/tablero/:id', rts.detallTablero) //mostrar uno
router.post('/delete/tablero/:id', rts.deleteTablero) //eliminar
router.post('/edit/tablero/:id', rts.editTablero) //actualizar

router.post('/lock/tablero/:id', rts.passwordTablero) //lock
router.post('/unlock/tablero/:id', rts.unlockTablero) //unlock

router.get('/all/tableros', rts.allTableros) //mostrar todos
router.post("/add/tablero", rts.addTablero) //crear

// rutas de listas- lista
router.get("/lista/count/:id", rts.countAllLista) //contador
router.get("/lista/detall/:id", rts.detallLista) //mostrar uno
// router.get("/lista/delete/:id", rts.deleteLista) //eliminar uno
router.post("/lista/delete/many", rts.deleteLista) //eliminar varios o uno
router.post("/lista/edit/:id", rts.editLista) //actualizar
router.post("/lista/add", rts.addLista) //crear
router.get("/lista/all", rts.allLista) //mostrar todos

// rutas de sub-listas - sub-lista
router.post("/sublista/add/:id/:id_tablero", rts.addSubLista) //crear
router.post("/sublista/removed/:id/:id_task", rts.removedSubLista) //eliminar
router.post("/sublista/edit-task/:id/:id_task", rts.editSubListaTask) //editar-task
router.post("/sublista/edit/:id/:id_task", rts.editSubLista) //editar
router.post("/sublista/sub/edit/:id/:id_task", rts.addSubListaSub) //editar
router.get("/sublista/tags/:id_task", rts.allTagsTask) //ver todas los tags de task

// tags
router.get("/tags/all", rts.allTags) //ver todos
router.get("/tag/detail/:id/:id_tablero", rts.detailTag) //ver datail
router.get("/tag/detail/task/:id_tablero/:title", rts.detailTagTask) //ver datail task
router.post("/tag/add", rts.addTag) //crear


module.exports = router
