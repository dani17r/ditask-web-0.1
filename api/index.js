const bodyParser = require('body-parser')
const express = require('express')
const app = express()
var cors = require('cors')
const { option, urlAccess } = require('./config')
const router = require('./routes')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.options('*', cors(urlAccess))
app.use(cors(urlAccess))
app.use(router)

app.listen(option)
