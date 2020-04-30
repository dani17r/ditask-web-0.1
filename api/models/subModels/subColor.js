const mongoose = require("mongoose")
const Schema = mongoose.Schema

let subColor = new Schema({
	tx:{ type: String, default:'#696969'},
	bg:{ type: String, default:'#f3f3f3'},
}, { _id: false })

module.exports = subColor
