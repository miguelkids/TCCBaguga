const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Registro de Usuário (Dono ou Jogador)
router.post('/register', async (req, res) => {
    try {
        const { nome, usuario, telefone, email, senha, tipo } = req.body;

        if (!email || !senha || !nome || !usuario || !tipo) {
            return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
        }

        if (tipo !== 'dono' && tipo !== 'jogador') {
            return res.status(400).json({ error: 'Tipo de usuário inválido.' });
        }

        // Verifica se o e-mail já existe
        const [existing] = await db.execute('SELECT email FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Este e-mail já está em uso.' });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // Gera ID único (substituindo o UID do Firebase)
        const id = uuidv4();

        // Insere no banco
        await db.execute(
            'INSERT INTO usuarios (id, nome, nome_usuario, telefone, email, senha_hash, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, nome, usuario, telefone, email, senhaHash, tipo]
        );

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id, tipo });
    } catch (err) {
        console.error('Erro no registro:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Login de Usuário
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
        }

        // Busca o usuário pelo e-mail
        const [users] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        const user = users[0];

        // Verifica a senha
        const validPassword = await bcrypt.compare(senha, user.senha_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, tipo: user.tipo },
            process.env.JWT_SECRET || 'sua_chave_secreta_super_segura',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login bem-sucedido',
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo: user.tipo
            }
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Retorna dados do perfil autenticado
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ error: 'Acesso negado' });

        const verified = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_super_segura');
        
        const [users] = await db.execute('SELECT id, nome, nome_usuario, telefone, email, tipo, faturamento_total, foto_perfil_url, cpf, genero, data_nascimento FROM usuarios WHERE id = ?', [verified.id]);
        if (users.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

        res.json(users[0]);
    } catch (err) {
        res.status(400).json({ error: 'Token inválido' });
    }
});

// Atualizar perfil do usuário autenticado
router.put('/perfil', upload.single('foto'), async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Acesso negado' });

        const verified = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_super_segura');
        const { nome, nomeUsuario, telefone, cpf, genero, dataNascimento } = req.body;

        if (req.file) {
            const fotoUrl = `/uploads/${req.file.filename}`;
            await db.execute(
                'UPDATE usuarios SET nome = ?, nome_usuario = ?, telefone = ?, foto_perfil_url = ?, cpf = ?, genero = ?, data_nascimento = ? WHERE id = ?',
                [nome, nomeUsuario, telefone, fotoUrl, cpf || null, genero || null, dataNascimento || null, verified.id]
            );
        } else {
            await db.execute(
                'UPDATE usuarios SET nome = ?, nome_usuario = ?, telefone = ?, cpf = ?, genero = ?, data_nascimento = ? WHERE id = ?',
                [nome, nomeUsuario, telefone, cpf || null, genero || null, dataNascimento || null, verified.id]
            );
        }

        res.json({ message: 'Perfil atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar perfil:', err);
        res.status(400).json({ error: 'Token inválido ou erro ao atualizar.' });
    }
});

module.exports = router;
