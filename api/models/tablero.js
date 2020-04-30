const mongoose = require("mongoose")
const lockTablero = require('./subModels/lockTablero')

const newTablero = new mongoose.Schema({
	name: String,
	description: String,
	state:{ type:Boolean, default:false },
	lock:{ type:lockTablero, default:lockTablero }
}, { versionKey:false })

var newModel = mongoose.model("Tablero", newTablero)

module.exports = newModel
