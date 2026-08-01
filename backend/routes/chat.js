// routes/chat.js — Chat entre jogadores e dono de quadra

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

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

// GET /api/chat/:quadraId — Lista mensagens de uma conversa (quadra + jogador logado)
router.get('/:quadraId', authenticateToken, async (req, res) => {
    try {
        const { quadraId } = req.params;
        const userId = req.user.id;
        const tipo = req.user.tipo;

        let rows;
        if (tipo === 'dono') {
            // Dono vê TODAS as conversas da quadra dele
            const [quadras] = await db.execute('SELECT dono_id FROM quadras WHERE id = ?', [quadraId]);
            if (quadras.length === 0) return res.status(404).json({ error: 'Quadra não encontrada.' });
            if (quadras[0].dono_id !== userId) return res.status(403).json({ error: 'Não autorizado.' });

            [rows] = await db.execute(
                `SELECT m.*, u.nome as usuario_nome FROM mensagens m
                 LEFT JOIN usuarios u ON u.id = m.remetente_id
                 WHERE m.quadra_id = ?
                 ORDER BY m.criado_em ASC`,
                [quadraId]
            );
        } else {
            // Jogador só vê as mensagens dele com a quadra
            [rows] = await db.execute(
                `SELECT * FROM mensagens
                 WHERE quadra_id = ? AND (remetente_id = ? OR tipo_remetente = 'dono')
                 ORDER BY criado_em ASC`,
                [quadraId, userId]
            );
        }

        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar mensagens:', err);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// GET /api/chat/:quadraId/threads — Lista threads (conversas) para o dono
router.get('/:quadraId/threads', authenticateToken, async (req, res) => {
    try {
        const { quadraId } = req.params;
        if (req.user.tipo !== 'dono') return res.status(403).json({ error: 'Apenas donos.' });

        const [quadras] = await db.execute('SELECT dono_id FROM quadras WHERE id = ?', [quadraId]);
        if (quadras.length === 0) return res.status(404).json({ error: 'Quadra não encontrada.' });
        if (quadras[0].dono_id !== req.user.id) return res.status(403).json({ error: 'Não autorizado.' });

        // Agrupa por jogador, pega última mensagem e contagem de não lidas
        const [threads] = await db.execute(
            `SELECT
                m.remetente_id as jogador_id,
                u.nome as jogador_nome,
                u.foto_perfil_url as jogador_foto,
                MAX(m.criado_em) as ultima_mensagem_em,
                (SELECT texto FROM mensagens WHERE quadra_id = ? AND (remetente_id = u.id OR (tipo_remetente = 'dono' AND quadra_id = ?)) ORDER BY criado_em DESC LIMIT 1) as ultima_mensagem,
                SUM(CASE WHEN m.lida_dono = FALSE AND m.tipo_remetente = 'jogador' THEN 1 ELSE 0 END) as nao_lidas
             FROM mensagens m
             JOIN usuarios u ON u.id = m.remetente_id
             WHERE m.quadra_id = ? AND m.tipo_remetente = 'jogador'
             GROUP BY m.remetente_id, u.nome, u.foto_perfil_url
             ORDER BY ultima_mensagem_em DESC`,
            [quadraId, quadraId, quadraId]
        );

        res.json(threads);
    } catch (err) {
        console.error('Erro ao listar threads:', err);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// GET /api/chat/:quadraId/jogador/:jogadorId — Mensagens de uma thread específica (dono)
router.get('/:quadraId/jogador/:jogadorId', authenticateToken, async (req, res) => {
    try {
        const { quadraId, jogadorId } = req.params;

        const [rows] = await db.execute(
            `SELECT m.*, u.nome as autor_real
             FROM mensagens m
             LEFT JOIN usuarios u ON u.id = m.remetente_id
             WHERE m.quadra_id = ?
               AND (m.remetente_id = ? OR (m.tipo_remetente = 'dono'))
             ORDER BY m.criado_em ASC`,
            [quadraId, jogadorId]
        );

        // Marcar como lidas para o dono
        if (req.user.tipo === 'dono') {
            await db.execute(
                `UPDATE mensagens SET lida_dono = TRUE
                 WHERE quadra_id = ? AND remetente_id = ? AND lida_dono = FALSE`,
                [quadraId, jogadorId]
            );
        }

        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar thread:', err);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// POST /api/chat/:quadraId — Enviar mensagem
router.post('/:quadraId', authenticateToken, async (req, res) => {
    try {
        const { quadraId } = req.params;
        const { texto, autorNome } = req.body;
        const remetenteId = req.user.id;
        const tipoRemetente = req.user.tipo;

        if (!texto || !texto.trim()) {
            return res.status(400).json({ error: 'Texto é obrigatório.' });
        }

        const [quadras] = await db.execute('SELECT id FROM quadras WHERE id = ?', [quadraId]);
        if (quadras.length === 0) return res.status(404).json({ error: 'Quadra não encontrada.' });

        await db.execute(
            `INSERT INTO mensagens (quadra_id, remetente_id, tipo_remetente, autor_nome, texto, lida_dono, lida_jogador)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                quadraId,
                remetenteId,
                tipoRemetente,
                autorNome || req.user.nome || 'Usuário',
                texto.trim(),
                tipoRemetente === 'dono' ? true : false,
                tipoRemetente === 'jogador' ? true : false,
            ]
        );

        res.status(201).json({ message: 'Mensagem enviada!' });
    } catch (err) {
        console.error('Erro ao enviar mensagem:', err);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// PUT /api/chat/:quadraId/lida — Marcar mensagens como lidas
router.put('/:quadraId/lida', authenticateToken, async (req, res) => {
    try {
        const { quadraId } = req.params;
        const { jogadorId } = req.body;
        const tipo = req.user.tipo;

        if (tipo === 'dono' && jogadorId) {
            await db.execute(
                `UPDATE mensagens SET lida_dono = TRUE WHERE quadra_id = ? AND remetente_id = ?`,
                [quadraId, jogadorId]
            );
        } else if (tipo === 'jogador') {
            await db.execute(
                `UPDATE mensagens SET lida_jogador = TRUE WHERE quadra_id = ? AND tipo_remetente = 'dono'`,
                [quadraId]
            );
        }

        res.json({ message: 'Mensagens marcadas como lidas.' });
    } catch (err) {
        console.error('Erro ao marcar lida:', err);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

module.exports = router;
