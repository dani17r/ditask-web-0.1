require('../conection')

let tablero = require('./tablero')
let lista = require('./lista')
let subLista = require('./subLista')
let tag = require('./tag')

module.exports = rts = {
    ...tablero,
    ...lista,
    ...subLista,
    ...tag
}
