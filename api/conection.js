const mongoose = require('mongoose')

// var keySecret = 'keySecretmykeynot'
var Uri = 'mongodb://localhost:27017/api_resfull'

const conection = mongoose.connect(Uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
})

conection.then(
  () => { console.log("connected") },
  err => { console.log("Error: ", err) }
)

module.exports = conection
