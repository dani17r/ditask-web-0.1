const mongoose = require("mongoose")
const newListaModel = require("../models/lista")

module.exports = {
	addLista: async (req, res, next) => {
		try {
			let lista = new newListaModel(req.body)
			const resp = await lista.save()
			res.json(resp)
		} catch (e) {
			res.status(204).json(null)
		}
	},
	allLista: async (req, res, next) => {
		try {
			let resp
			if (req.query.where_ != null || undefined || '') {
				resp = await newListaModel.find(req.query.where_)
			}else {
				resp = await newListaModel.find()
			}
			res.json(resp)
		} catch (e) {
			res.status(204).json(null)
		}
	},
	countAllLista: async (req, res, next) => {
		try {
			// console.log(req.query.where);
			let resp
			if (req.query.where != null || undefined || '') {
				resp = await newListaModel.find({
					"id_tablero" : req.params.id,
					"delete":req.query.where
				}).countDocuments()
			} else {
				resp = await newListaModel.find({ "id_tablero" : req.params.id }).count()
			}
			res.json(resp)
		} catch (e) {
			console.log('countAllLista error: '+e);
		}
	},
	detallLista: async (req, res, next) => {
		try {
			let resp
			if (req.query.sort != null || undefined || '') {
				resp = await newListaModel.find({ id_tablero:req.params.id }).sort({_index:1})
			} else {
				resp = await newListaModel.find({ id_tablero:req.params.id })
			}
			res.json(resp)
		} catch (e) {
			res.status(204).json(null)
		}
	},
	editLista: async (req, res, next) => {
		try {
			let resp = await newListaModel.updateOne(
			   {  _id : req.params.id },
			   { $set: req.body  }
			)
			res.json(resp)
		} catch (e) {
			res.status(204).json(null)
		}
	},
	deleteLista: async (req, res, next) => {
		try {
			let resp = await newListaModel.deleteMany({
				_id: { $in: req.body }
			})
			res.json(resp)
		} catch (e) {
			res.status(204).json(null)
		}
	},
	detallListaSortTask: async (req, res, next) => {
		try {
			let resp = await newListaModel.aggregate([
				{$match: { id_tablero:req.params.id } },
			    {$unwind: { path:'$list', preserveNullAndEmptyArrays:true } },
			    {$sort: {'list._index': 1} },
			    {$group: {
			            _id: '$_id',
			            disable:{ $first: '$disable' },
			            delete: { $first: '$delete' },
			            color: { $first:'$color' },
			            id_tablero : { $first: '$id_tablero' },
			            _index: { $first: '$_index' },
			            name:{ $first:'$name'},
			            newlist: { $push:'$list' },
			    } },
			    {$project: {
			        disable:'$disable',
			        delete:'$delete',
			        color:'$color',
			        id_tablero:'$id_tablero',
			        _index:'$_index',
			        name:'$name',
			        list:'$newlist'
			    } }
			])
			res.json(resp)
		} catch (e) {
			console.log('allListaSortTask error: '+e)
		}

	}
}
