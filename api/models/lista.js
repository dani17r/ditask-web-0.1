const mongoose = require("mongoose")
const Schema = mongoose.Schema
const subLista = require('./subModels/subLista')
const subColor = require('./subModels/subColor')

let newLista = new Schema({
	id_tablero: String,
	_index:Number,
	name: String,
	list: { type: [subLista], default: [] },
	disable:{ type:Boolean, default:true },
	delete: { type: Boolean, default: false	},
	color:{ type:subColor, default:subColor }
}, { versionKey:false })

var newModel = mongoose.model("Lista", newLista)
module.exports = newModel
