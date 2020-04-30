const newTag = require("../models/tag")

module.exports = {

    addTag: async (req, res, next) => {
        try {
            let tablero = new newTag(req.body)
            const resp = await tablero.save()
            res.json(resp)
        } catch (e) {
            console.log('error addTag: '+e)
        }
    },
    allTags: async (req, res, next) => {
        try {
            const resp = await newTag.find({})
            res.json(resp)
        } catch (e) {
            console.log('error allTags: '+e)
        }
    },
    detailTag: async (req, res, next) => {
        try {
            const resp = await newTag.find({
                _id:req.params.id,
                id_tablero:req.params.id_tablero
            })
            res.json(resp)
        } catch (e) {
            console.log('error detailTag: '+e)
        }
    },
    detailTagTask: async (req, res, next) => {
        try {
            const resp = await newTag.find({
                id_tablero:req.params.id_tablero,
                title:req.params.title
            })
            res.json(resp)
        } catch (e) {
            console.log('error detailTagTask: '+e)
        }
    },
}
