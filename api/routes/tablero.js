const newTableroModel = require('../models/tablero')
const newListaModel = require("../models/lista")

const bcrypt = require('bcrypt')
const saltRounds = 2

module.exports = {

    inicio: (req, res, next) => {
        res.send('inicio')
    },

    allTableros: async (req, res, next) => {
        try {
            const resp = await newTableroModel.find({})
            res.json(resp)
        } catch (e) {
            // console.log('error alltableros:: '+e)
            res.status(204).json(null)
        }
    },

    detallTablero: async (req, res, next) => {
        try {
            const resp = await newTableroModel.findById(req.params.id)
            res.json(resp)
        } catch (e) {
            res.status(204).json(null)
            // console.log('error alltableros:: '+e)
        }
    },

    addTablero: async (req, res, next) => {
        try {
        let tablero = new newTableroModel(req.body)
            const resp = await tablero.save()
            res.json(resp)
        } catch (e) {
            console.log('error addtablero: '+e)
        }
    },

    deleteTablero: async (req, res, next) => {
        try {
            let resp = await newTableroModel.findByIdAndRemove(req.params.id)
            let respList = await newListaModel.deleteMany({
                id_tablero : req.params.id,
                delete: false
            })
            res.send({ tablero:resp, listas:respList })
        } catch (e) {
            console.log('deleteTablero error: '+e);
        }
    },

    editTablero: async (req, res, next) => {
        try {
			let resp = await newTableroModel.updateOne(
			   {  _id : req.params.id },
			   { $set: req.body  }
			)
			res.json(resp)
		} catch (e) {
			res.status(204).json(null)
		}
    },

    passwordTablero: async (req, res, next) => {
        try {
            if (req.body.lock.password != '' || null || undefined) {
                let password = req.body.lock.password
                let hashedPassword = bcrypt.hashSync(password, saltRounds)
                req.body.lock.password = hashedPassword
            }
            console.log(req.body)
			let resp = await newTableroModel.updateOne(
			   {  _id : req.params.id },
			   { $set: req.body  }
			)
			res.json(resp)
		} catch (e) {
			res.status(204).json(null)
		}
    },
    unlockTablero: async (req, res, next) => {
        try {
			let tableroActual = await newTableroModel.findById(req.params.id)
            let resp = bcrypt.compareSync(req.body.password, tableroActual.lock.password)
			res.json(resp)
		} catch (e) {
			res.status(204).json(null)
		}
    },
}
