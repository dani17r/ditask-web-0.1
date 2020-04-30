const mongoose = require("mongoose")
const Schema = mongoose.Schema

let subList = new Schema({
	_index:{ type:Number, index: true },
	title:{ type: String },
	description:{ type: String },
	tags:[{ index:Number, id_tag:String, color:String }],
	dateEvent:{
		dateNow:String,
		dateVence:String
	},
	state:{ type: Boolean, default:false },
	disable:{ type: Boolean, default:true },
	_new:String
}, { autoIndex: false, autoCreate: false })

module.exports = subList
