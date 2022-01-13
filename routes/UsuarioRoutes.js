const router = require('express').Router()

const UsuarioController = require('../controllers/UsuarioController.js')

const verifyToken = require('../helpers/chack-token')

router.post('/register', UsuarioController.register)
router.post('/login', UsuarioController.login)
router.get('/checkuser', UsuarioController.checkUser)
router.get('/:id', UsuarioController.checkUserId)
router.patch('/edit/:id', verifyToken ,UsuarioController.updateUser)

module.exports = router