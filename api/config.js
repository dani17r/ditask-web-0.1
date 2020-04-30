const option = {
    port :process.env.PORT || 9001,
    hostname: 'api-resfull.test',
}
const urlAccess = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200,
    preflightContinue: false,
}

module.exports = { option, urlAccess }
