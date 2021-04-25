//imports
const express = require('express')
const app = express()
const redis = require('redis')
const basicAuth = require ('express-basic-auth')
const {promisify} = require('util')
const {Console} = require('console')

//instancias
app.use(express.json())
const client = redis.createClient({port: 6739})
var version = 1





const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))