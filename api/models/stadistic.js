const mongoose = require("mongoose")

const stadistic = new mongoose.Schema({
	password:{ type:[{ passwordList:[{}] }] },
	unlokPassword:{},
	login:{},
})

var newModel = mongoose.model("stadistic", stadistic)

module.exports = newModel
