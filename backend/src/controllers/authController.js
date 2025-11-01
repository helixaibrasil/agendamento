const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

class AuthController {
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = Usuario.findByEmail(email);

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      if (!usuario.ativo) {
        return res.status(401).json({ error: 'Usuário inativo' });
      }

      const senhaValida = await Usuario.verifyPassword(senha, usuario.senha_hash);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  static async me(req, res) {
    try {
      const usuario = Usuario.findById(req.userId);
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  static async changePassword(req, res) {
    try {
      const { senhaAtual, novaSenha } = req.body;

      const usuario = Usuario.findByEmail(req.userEmail);
      const senhaValida = await Usuario.verifyPassword(senhaAtual, usuario.senha_hash);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }

      await Usuario.updatePassword(req.userId, novaSenha);

      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao alterar senha' });
    }
  }
}

module.exports = AuthController;
