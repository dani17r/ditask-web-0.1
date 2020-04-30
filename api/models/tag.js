const mongoose = require("mongoose")

const newTag = new mongoose.Schema({
	title: String,
	id_tablero:String,
	global:{
		use:{ type:Boolean, default: false },
		color: { type:String, default:"#e0e0e0"},
		lock:{ type:Boolean, default: false }
	},
}, { versionKey:false })

var newModel = mongoose.model("Tag", newTag)

module.exports = newModel
