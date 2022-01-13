const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//? Validator
const validateCpf = require('cpf-cnpj-validator')
const validatorEmail = require("email-validator")

//? helpers
const getToken = require('../helpers/get_token')
const createUsuarioToken = require('../helpers/create-user-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UsuarioController{
    static async register(req, res) {
        const { name, surname,cpf,age, email,password,confirmpassword,} = req.body
        
        //? Validation
        if (!name){
            res.status(422).json({ message: 'O nome é Obrigatorio' })
            return
        }

        if (!surname){
            res.status(422).json({ message: 'O sobrenome é Obrigatorio' })
            return
        }

        if (cpf) {
        const validaCpf = validateCpf.cpf.isValid(cpf)  
            if (!validaCpf) {
            res.status(422).json({ message: 'O Cpf não é valido' })
                return                
            }   
        } else {
            res.status(422).json({ message: 'A Cpf é Obrigatorio' })
                return            
        }


        if (!age){
            res.status(422).json({ message: 'A idade é Obrigatorio' })
            return
        }    
        
        if (email){
            const emailTrue = validatorEmail.validate(email)
            if (!emailTrue) {
                res.status(422).json({ message: 'Email invalido' })
                    return            
            } if (!email) {
                res.status(422).json({ message: 'O e-mail é obrigatorio' })
                    return  
            }    
        }
        if (!password){
            res.status(422).json({ message: 'A senha é Obrigatorio' })
            return
        }

        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatoria' })
            return
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'As senhas não se corespondem' })
        }
            

        //? check if User exists
        const usuarioExiste = await Usuario.findOne({ email: email })
        
        if (usuarioExiste) {
            res.status(422).json({ message: 'Email já existente em nosso banco de dados' })  
                return
        }

         //? incrimping new password

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)  
        
        //? mask of Cpf
        const maskCpf = validateCpf.cpf.format(cpf)
        
        //? create
        const usuario = new Usuario({
            name,
            surname,
            cpf:maskCpf,
            age,
            email,
            password:passwordHash,
        })
        try {
            
            const novoUsuario = await usuario.save()

            await createUsuarioToken(novoUsuario, req ,res)            


        }catch (err) {
            res.status(500).json({message:err})
        }
    } 
    
    static async login(req, res) {
        const { email, password } = req.body
        
        if (!email) {
            res.status(422).json({ message: 'O campo email é Obrigatório'})
        }

        if (!password) {
            res.status(422).json({ message: 'O campo senha é Obrigatório'})
        }

        //* check if user exist
        

        const usuario = await Usuario.findOne({ email: email })

        if (!usuario) {
            res.status(422).json({ message: 'O e-mail ou a senha estam estão inválidas' })
            return
        }   

        //* Comparing the passwords

        const compsenha = await bcrypt.compare(password, usuario.password)
        
        if (!compsenha) {
            res.status(422).json({ message: 'O e-mail ou a senha estam estão inválidas' })
            return           
        }

        await createUsuarioToken(usuario, req, res)
    }
    
    static async checkUser(req, res) {
        let usercorent

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')
            
            usercorent = await Usuario.findById(decoded.id)
            usercorent.password = undefined
        }
        else {
            usercorent = null
        }
        res.status(200).send(usercorent)
    }

    static async checkUserId(req, res) {
    
        const id = req.params.id

        const usuario = await Usuario.findById(id).select('-password')

        if (!usuario) {
            res.status(422).json({ message: 'Usuario não encontrado' })
            return   
        }
        res.status(200).json({ usuario })
    }

    static async updateUser(req, res) {
        const token = getToken(req)
       
        const usuario = await getUserByToken(token)

        console.log(token)
        console.log(usuario.id)
        
        const name = req.body.name
        const surname = req.body.surname
        const age = req.body.age
        const cpf = req.body.cpf
        const email = req.body.email
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword

        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
                return
        }   
        usuario.name = name

        if (!surname){
            res.status(422).json({ message: 'O sobrenome é Obrigatorio' })
            return
        }

        usuario.surname = surname

        if (cpf) {
        const validaCpf = validateCpf.cpf.isValid(cpf)  
            if (!validaCpf) {
            res.status(422).json({ message: 'O Cpf não é valido' })
                return                
            }   
        } else {
            res.status(422).json({ message: 'A Cpf é Obrigatorio' })
                return            
        }

        usuario.cpf = cpf

        if (!age){
            res.status(422).json({ message: 'A idade é Obrigatorio' })
            return
        }    

        usuario.age = age
        
        if (email){
            const emailTrue = validatorEmail.validate(email)
            if (!emailTrue) {
                res.status(422).json({ message: 'Email invalido' })
                    return            
            } if (!email) {
                res.status(422).json({ message: 'O e-mail é obrigatorio' })
                    return  
            }    
        }

        usuario.email = email

        if (!password){
            res.status(422).json({ message: 'A senha é Obrigatorio' })
            return
        }

        usuario.password = password

        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatoria' })
            return
        }

        usuario.confirmpassword = confirmpassword

        if (password!== confirmpassword) {
            res.status(422).json({ message: 'As senhas não se corespondem' })
            return
        }

        else if (password == confirmpassword && password != null) {
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            usuario.password = passwordHash 
        }
  try {
      // returns updated data
      const updatedUser = await Usuario.findOneAndUpdate(
        { _id: usuario._id },
        { $set: usuario },
        { new: true },
      )
      res.json({
        message: 'Usuário atualizado com sucesso!',
        data: updatedUser,
      })
    } catch (error) {
      res.status(500).json({ message: error })
    }
    }
}
