const express = require('express')
const app = express()

app.use(express.json())


app.use(express.static('public'))

const UsuarioRoutes = require('./routes/UsuarioRoutes')

app.use('/usuario', UsuarioRoutes)

app.listen(3000)