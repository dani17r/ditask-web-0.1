const newListaModel = require("../models/lista")
const mongoose = require("mongoose")

module.exports = {
	addSubLista: async (req, res, next) => {
		try {
        	await newListaModel.updateOne(
			   { _id:req.params.id, id_tablero:req.params.id_tablero},
			   { $push:{ list:req.body } }
			)
			let resp = await newListaModel.aggregate([
				{ $unwind: "$list"},
			  	{ $match: { "list._index": req.body._index, "list.title": req.body.title } },
			   	{"$replaceRoot": { "newRoot": "$list" } }
			])
            res.json(resp)
		} catch (e) {
            console.log('addSubLista error: '+e)
			res.status(204).json(null)
		}
	},
	removedSubLista: async (req, res, next) => {
		try {
        	let resp = await newListaModel.updateOne(
			   { _id:req.params.id },
			   { $pull: { list: {_id:req.params.id_task } } }
			)
            res.json(resp)
		} catch (e) {
            console.log('removedSubLista error: '+e)
			res.status(204).json(null)
		}
	},
	editSubListaTask: async (req, res, next) => {
		try {
			let resp = await newListaModel.updateOne(
				{ _id :req.params.id, 'list._id':req.params.id_task },
				{ $set: req.body },
				{ overwrite:true }
			)
			await newListaModel.updateOne(
				{  _id :req.params.id },
				{ $push: { list: { $each: [ ], $sort: { _index: 1 } }  } },
				{ overwrite:true }
			)
			res.json(resp)
		} catch (e) {
            console.log('editSubListaTask error: '+e)
			res.status(204).json(null)
		}
	},
	editSubLista: async (req, res, next) => {
		try {
			let resp = await newListaModel.updateOne(
				{ id_tablero :req.params.id, 'list._id':req.params.id_task },
				{ $set: req.body },
				{ overwrite:true }
			)
			res.json(resp)
		} catch (e) {
            console.log('editSubListaTwo error: '+e)
			res.status(204).json(null)
		}
	},
	addSubListaSub: async (req, res, next) => {
		try {
			let resp = await newListaModel.updateOne(
				{ id_tablero :req.params.id, 'list._id':req.params.id_task },
				{ $push: req.body },
				{ overwrite:true }
			)
			res.json(resp)
		} catch (e) {
            console.log('addSubListaSub error: '+e)
			res.status(204).json(null)
		}
	},
	allTagsTask: async (req, res, next) => {
		try {
			let resp = await newListaModel.aggregate([
				{ $unwind: '$list' },
				{ $unwind: '$list.tags' },
				{ $match: { "list._id" : mongoose.Types.ObjectId(req.params.id_task) } },
			   	{ "$replaceRoot": { "newRoot": "$list.tags" } }
			])
			res.json(resp)
		} catch (e) {
            console.log('allTagsTask error: '+e)
			res.status(204).json(null)
		}
	},
}
