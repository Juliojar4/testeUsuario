const mongoose = require('../db/conn')
const { Schema } = mongoose

const Usuario = mongoose.model(
    'Usurio',
    new Schema({
    name: {
        type: String,
        required:true
    },
    surname: {
        type:String,
        required:true
    },
    
    cpf: {
        type: String,
        required:true
    },

    age: {
        type: Number,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    }
  },{timeseries:true},)
)

module.exports = Usuario