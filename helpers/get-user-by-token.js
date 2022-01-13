const jwt = require('jsonwebtoken')

const Usuario = require("../models/Usuario")

const getUsuarioByToken = async (token) => {
  if (!token) {
    return res.status(401).json({ error: "Acesso negado!" });
  }
  // find user
  const decoded = jwt.verify(token, "nossosecret");

  const userId = decoded.id;

  const user = await Usuario.findOne({ _id: userId });

  return user;
};



module.exports = getUsuarioByToken