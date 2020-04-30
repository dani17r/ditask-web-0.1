const mongoose = require("mongoose")
const Schema = mongoose.Schema

let lockTablero = new Schema({
	state:{ type:Boolean, default:false },
	email:String,
	password:String,
	resetPassword:String,
	disableTime:String,
}, { _id: false })

module.exports = lockTablero
