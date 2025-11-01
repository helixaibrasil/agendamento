const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = Usuario.findById(decoded.id);

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ error: 'Usuário inválido ou inativo' });
    }

    req.userId = decoded.id;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(500).json({ error: 'Erro na autenticação' });
  }
};

module.exports = authMiddleware;
