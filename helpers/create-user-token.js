const jwt = require('jsonwebtoken')

const createUsuarioToken = async (usuario, req, res) => {
    
   const token = jwt.sign(
    {
        name: usuario.name,
        id: usuario._id,
    }, "nossosecret")
    
    //* return token
    res.status(200).json({
        message: "Voce está autenticado",
        token: token,
        userId: usuario._id,
        
    })     
}

module.exports = createUsuarioToken
