const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const jwt = require('jsonwebtoken');
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

// Middleware para verificar o token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_super_segura', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Criar uma nova quadra (apenas para Donos)
router.post('/', authenticateToken, upload.single('foto'), async (req, res) => {
    try {
        if (req.user.tipo !== 'dono') {
            return res.status(403).json({ error: 'Apenas donos podem cadastrar quadras.' });
        }

        const { nomeQuadra, endereco, cidade, telefone, preco, descricao, horario, esporte } = req.body;
        const id = uuidv4();
        const dono_id = req.user.id;
        const fotoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.fotoUrl;

        await db.execute(
            `INSERT INTO quadras (id, dono_id, nome, endereco, cidade, telefone, preco, descricao, foto_url, horario, esporte)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, dono_id, nomeQuadra, endereco, cidade, telefone, preco, descricao, fotoUrl, horario, esporte || 'Futebol']
        );

        res.status(201).json({ message: 'Quadra cadastrada com sucesso!', id });
    } catch (err) {
        console.error('Erro ao cadastrar quadra:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Listar todas as quadras
router.get('/', async (req, res) => {
    try {
        const [quadras] = await db.execute('SELECT * FROM quadras');
        const quadrasFormatadas = quadras.map(q => ({
            id: q.id,
            donoId: q.dono_id,
            nomeQuadra: q.nome,
            endereco: q.endereco,
            cidade: q.cidade,
            telefone: q.telefone,
            preco: q.preco,
            descricao: q.descricao,
            fotoUrl: q.foto_url,
            horario: q.horario,
            esporte: q.esporte || 'Futebol',
            mediaAvaliacao: q.media_avaliacao
        }));
        res.json(quadrasFormatadas);
    } catch (err) {
        console.error('Erro ao listar quadras:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Listar quadras do dono logado
router.get('/minhas', authenticateToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'dono') {
            return res.status(403).json({ error: 'Apenas donos podem acessar este recurso.' });
        }
        const [quadras] = await db.execute('SELECT * FROM quadras WHERE dono_id = ?', [req.user.id]);
        const quadrasFormatadas = quadras.map(q => ({
            id: q.id,
            donoId: q.dono_id,
            nomeQuadra: q.nome,
            endereco: q.endereco,
            cidade: q.cidade,
            telefone: q.telefone,
            preco: q.preco,
            descricao: q.descricao,
            fotoUrl: q.foto_url,
            horario: q.horario,
            esporte: q.esporte || 'Futebol',
            mediaAvaliacao: q.media_avaliacao
        }));
        res.json(quadrasFormatadas);
    } catch (err) {
        console.error('Erro ao listar quadras do dono:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Buscar quadra por ID
router.get('/:id', async (req, res) => {
    try {
        const [quadras] = await db.execute('SELECT * FROM quadras WHERE id = ?', [req.params.id]);
        if (quadras.length === 0) return res.status(404).json({ error: 'Quadra não encontrada.' });
        
        const [avaliacoesResult] = await db.execute('SELECT COUNT(id) as total FROM avaliacoes WHERE quadra_id = ?', [req.params.id]);
        const totalAvaliacoes = avaliacoesResult[0].total || 0;

        const q = quadras[0];
        res.json({
            id: q.id,
            donoId: q.dono_id,
            nomeQuadra: q.nome,
            endereco: q.endereco,
            cidade: q.cidade,
            telefone: q.telefone,
            preco: q.preco,
            descricao: q.descricao,
            fotoUrl: q.foto_url,
            horario: q.horario,
            esporte: q.esporte || 'Futebol',
            mediaAvaliacao: q.media_avaliacao,
            totalAvaliacoes: totalAvaliacoes
        });
    } catch (err) {
        console.error('Erro ao buscar quadra:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Buscar ocupações de uma quadra
router.get('/:id/ocupacoes', async (req, res) => {
    try {
        const quadraId = req.params.id;
        
        const [datas] = await db.execute('SELECT data_ocupada as data FROM datas_ocupadas WHERE quadra_id = ?', [quadraId]);
        const [horarios] = await db.execute('SELECT data_ocupada as data, horario_ocupado as horario FROM horarios_ocupados WHERE quadra_id = ?', [quadraId]);
        // Exclui reservas contra_time sem adversário (aguardando) — esses slots aparecem em laranja no frontend
        const [reservas] = await db.execute(
            `SELECT data_reserva as data, horario_reserva as horario FROM reservas
             WHERE quadra_id = ?
               AND NOT (tipo_jogo = 'contra_time' AND confirmada = FALSE AND nome_time_b IS NULL)`,
            [quadraId]
        );

        res.json({
            datasOcupadas: datas.map(d => d.data),
            horariosOcupados: horarios,
            reservas: reservas
        });
    } catch (err) {
        console.error('Erro ao buscar ocupações:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Atualizar quadra
router.put('/:id', authenticateToken, upload.single('foto'), async (req, res) => {
    try {
        const { nomeQuadra, endereco, cidade, telefone, preco, descricao, horario, esporte } = req.body;
        
        // Verifica se a quadra pertence ao dono logado
        const [quadras] = await db.execute('SELECT dono_id FROM quadras WHERE id = ?', [req.params.id]);
        if (quadras.length === 0) return res.status(404).json({ error: 'Quadra não encontrada.' });
        if (quadras[0].dono_id !== req.user.id) return res.status(403).json({ error: 'Não autorizado.' });

        if (req.file) {
            const fotoUrl = `/uploads/${req.file.filename}`;
            await db.execute(
                `UPDATE quadras SET nome = ?, endereco = ?, cidade = ?, telefone = ?, preco = ?, descricao = ?, foto_url = ?, horario = ?, esporte = ?
                 WHERE id = ?`,
                [nomeQuadra, endereco, cidade, telefone, preco, descricao, fotoUrl, horario, esporte || 'Futebol', req.params.id]
            );
        } else {
            await db.execute(
                `UPDATE quadras SET nome = ?, endereco = ?, cidade = ?, telefone = ?, preco = ?, descricao = ?, horario = ?, esporte = ?
                 WHERE id = ?`,
                [nomeQuadra, endereco, cidade, telefone, preco, descricao, horario, esporte || 'Futebol', req.params.id]
            );
        }

        res.json({ message: 'Quadra atualizada com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar quadra:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Listar horários ocupados de uma quadra por data
router.get('/:id/horarios-ocupados', authenticateToken, async (req, res) => {
    try {
        const { data } = req.query;
        let rows;
        if (data) {
            [rows] = await db.execute(
                'SELECT id, data_ocupada as data, horario_ocupado as horario FROM horarios_ocupados WHERE quadra_id = ? AND data_ocupada = ?',
                [req.params.id, data]
            );
        } else {
            [rows] = await db.execute(
                'SELECT id, data_ocupada as data, horario_ocupado as horario FROM horarios_ocupados WHERE quadra_id = ?',
                [req.params.id]
            );
        }
        res.json(rows);
    } catch (err) {
        console.error('Erro ao listar horários ocupados:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Marcar horário como ocupado
router.post('/:id/horarios-ocupados', authenticateToken, async (req, res) => {
    try {
        const { data, horario } = req.body;
        if (!data || !horario) return res.status(400).json({ error: 'data e horario são obrigatórios.' });

        const [quadras] = await db.execute('SELECT dono_id FROM quadras WHERE id = ?', [req.params.id]);
        if (quadras.length === 0) return res.status(404).json({ error: 'Quadra não encontrada.' });
        if (quadras[0].dono_id !== req.user.id) return res.status(403).json({ error: 'Não autorizado.' });

        const [result] = await db.execute(
            'INSERT INTO horarios_ocupados (quadra_id, data_ocupada, horario_ocupado) VALUES (?, ?, ?)',
            [req.params.id, data, horario]
        );
        res.status(201).json({ message: 'Horário marcado como ocupado!', id: result.insertId });
    } catch (err) {
        console.error('Erro ao marcar horário ocupado:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Desmarcar horário ocupado
router.delete('/:quadraId/horarios-ocupados/:id', authenticateToken, async (req, res) => {
    try {
        const [quadras] = await db.execute('SELECT dono_id FROM quadras WHERE id = ?', [req.params.quadraId]);
        if (quadras.length === 0) return res.status(404).json({ error: 'Quadra não encontrada.' });
        if (quadras[0].dono_id !== req.user.id) return res.status(403).json({ error: 'Não autorizado.' });

        await db.execute('DELETE FROM horarios_ocupados WHERE id = ? AND quadra_id = ?', [req.params.id, req.params.quadraId]);
        res.json({ message: 'Horário liberado!' });
    } catch (err) {
        console.error('Erro ao desmarcar horário:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Listar datas inteiramente ocupadas
router.get('/:id/datas-ocupadas', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, data_ocupada as data FROM datas_ocupadas WHERE quadra_id = ?',
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        console.error('Erro ao listar datas ocupadas:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Marcar data inteira como ocupada
router.post('/:id/datas-ocupadas', authenticateToken, async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) return res.status(400).json({ error: 'data é obrigatória.' });

        const [quadras] = await db.execute('SELECT dono_id FROM quadras WHERE id = ?', [req.params.id]);
        if (quadras.length === 0) return res.status(404).json({ error: 'Quadra não encontrada.' });
        if (quadras[0].dono_id !== req.user.id) return res.status(403).json({ error: 'Não autorizado.' });

        const [result] = await db.execute(
            'INSERT INTO datas_ocupadas (quadra_id, data_ocupada) VALUES (?, ?)',
            [req.params.id, data]
        );
        res.status(201).json({ message: 'Data marcada como ocupada!', id: result.insertId });
    } catch (err) {
        console.error('Erro ao marcar data ocupada:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Desmarcar data ocupada
router.delete('/:quadraId/datas-ocupadas/:id', authenticateToken, async (req, res) => {
    try {
        const [quadras] = await db.execute('SELECT dono_id FROM quadras WHERE id = ?', [req.params.quadraId]);
        if (quadras.length === 0) return res.status(404).json({ error: 'Quadra não encontrada.' });
        if (quadras[0].dono_id !== req.user.id) return res.status(403).json({ error: 'Não autorizado.' });

        await db.execute('DELETE FROM datas_ocupadas WHERE id = ? AND quadra_id = ?', [req.params.id, req.params.quadraId]);
        res.json({ message: 'Data liberada!' });
    } catch (err) {
        console.error('Erro ao desmarcar data:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Atualizar perfil de usuário (nome, telefone, etc.)
router.put('/usuarios/perfil', authenticateToken, async (req, res) => {
    try {
        const { nome, nomeUsuario, telefone } = req.body;
        await db.execute(
            'UPDATE usuarios SET nome = ?, nome_usuario = ?, telefone = ? WHERE id = ?',
            [nome, nomeUsuario, telefone, req.user.id]
        );
        res.json({ message: 'Perfil atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar perfil:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Avaliar quadra
router.post('/:id/avaliar', authenticateToken, async (req, res) => {
    try {
        const { estrelas } = req.body;
        const quadraId = req.params.id;
        const usuarioId = req.user.id;

        if (!estrelas || estrelas < 1 || estrelas > 5) {
            return res.status(400).json({ error: 'Estrelas devem ser entre 1 e 5.' });
        }

        const [quadras] = await db.execute('SELECT id FROM quadras WHERE id = ?', [quadraId]);
        if (quadras.length === 0) return res.status(404).json({ error: 'Quadra não encontrada.' });

        const [avaliacoesExistentes] = await db.execute('SELECT id FROM avaliacoes WHERE quadra_id = ? AND usuario_id = ?', [quadraId, usuarioId]);
        
        if (avaliacoesExistentes.length > 0) {
            await db.execute('UPDATE avaliacoes SET estrelas = ? WHERE id = ?', [estrelas, avaliacoesExistentes[0].id]);
        } else {
            await db.execute('INSERT INTO avaliacoes (quadra_id, usuario_id, estrelas) VALUES (?, ?, ?)', [quadraId, usuarioId, estrelas]);
        }

        const [resultado] = await db.execute('SELECT AVG(estrelas) as media, COUNT(id) as total FROM avaliacoes WHERE quadra_id = ?', [quadraId]);
        const novaMedia = parseFloat(resultado[0].media).toFixed(2);
        const totalAvaliacoes = resultado[0].total;

        await db.execute('UPDATE quadras SET media_avaliacao = ? WHERE id = ?', [novaMedia, quadraId]);

        res.json({ message: 'Avaliação registrada!', novaMedia, totalAvaliacoes });
    } catch (err) {
        console.error('Erro ao avaliar quadra:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = router;
