// routes/dashboard.js — KPIs e analytics para o painel do dono

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

// GET /api/dashboard/kpis?mes=YYYY-MM — KPIs mensais do dono
router.get('/kpis', authenticateToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'dono') return res.status(403).json({ error: 'Apenas donos.' });

        const mes = req.query.mes || new Date().toISOString().slice(0, 7);
        const [ano, m] = mes.split('-');

        // Busca quadras do dono
        const [quadras] = await db.execute('SELECT id FROM quadras WHERE dono_id = ?', [req.user.id]);
        const quadraIds = quadras.map(q => q.id);

        if (quadraIds.length === 0) {
            return res.json({
                faturamento: 0, aReceber: 0, horasMarcadas: 0,
                horasNaoPagas: 0, confirmadas: 0, canceladas: 0,
                totalClientes: 0, mediaAvaliacao: null
            });
        }

        const placeholders = quadraIds.map(() => '?').join(',');

        // Reservas do mês
        const [reservas] = await db.execute(
            `SELECT r.*, r.preco_total, r.status, r.confirmada
             FROM reservas r
             WHERE r.quadra_id IN (${placeholders})
               AND YEAR(r.data_reserva) = ?
               AND MONTH(r.data_reserva) = ?`,
            [...quadraIds, ano, parseInt(m)]
        );

        let faturamento = 0, aReceber = 0, horasMarcadas = 0;
        let horasNaoPagas = 0, confirmadas = 0, canceladas = 0;

        for (const r of reservas) {
            const status = r.status || (r.confirmada ? 'confirmada' : 'pendente');
            if (status === 'cancelada') { canceladas++; continue; }
            if (status === 'confirmada') confirmadas++;
            if (status === 'confirmada' || status === 'encerrada') {
                horasMarcadas++;
                const total = parseFloat(r.preco_total) || 0;
                if (status === 'encerrada') faturamento += total;
                else { aReceber += total; if (total > 0) horasNaoPagas++; }
            }
        }

        // Total de clientes únicos
        const [clientesResult] = await db.execute(
            `SELECT COUNT(DISTINCT jogador_id) as total FROM reservas
             WHERE quadra_id IN (${placeholders}) AND jogador_id IS NOT NULL`,
            quadraIds
        );

        // Média de avaliações
        const [avgResult] = await db.execute(
            `SELECT AVG(a.estrelas) as media FROM avaliacoes a
             WHERE a.quadra_id IN (${placeholders})`,
            quadraIds
        );

        res.json({
            faturamento: parseFloat(faturamento.toFixed(2)),
            aReceber: parseFloat(aReceber.toFixed(2)),
            horasMarcadas,
            horasNaoPagas,
            confirmadas,
            canceladas,
            totalClientes: clientesResult[0].total || 0,
            mediaAvaliacao: avgResult[0].media ? parseFloat(parseFloat(avgResult[0].media).toFixed(1)) : null
        });
    } catch (err) {
        console.error('Erro ao calcular KPIs:', err);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// GET /api/dashboard/serie-diaria?mes=YYYY-MM — Série de faturamento diário
router.get('/serie-diaria', authenticateToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'dono') return res.status(403).json({ error: 'Apenas donos.' });

        const mes = req.query.mes || new Date().toISOString().slice(0, 7);
        const [ano, m] = mes.split('-');

        const [quadras] = await db.execute('SELECT id FROM quadras WHERE dono_id = ?', [req.user.id]);
        const quadraIds = quadras.map(q => q.id);

        if (quadraIds.length === 0) return res.json([]);

        const diasNoMes = new Date(parseInt(ano), parseInt(m), 0).getDate();
        const placeholders = quadraIds.map(() => '?').join(',');

        const [rows] = await db.execute(
            `SELECT DAY(data_reserva) as dia, SUM(preco_total) as valor, COUNT(*) as reservas
             FROM reservas
             WHERE quadra_id IN (${placeholders})
               AND YEAR(data_reserva) = ?
               AND MONTH(data_reserva) = ?
               AND status = 'encerrada'
             GROUP BY DAY(data_reserva)`,
            [...quadraIds, ano, parseInt(m)]
        );

        const mapa = {};
        for (const r of rows) mapa[r.dia] = { valor: parseFloat(r.valor), reservas: r.reservas };

        const serie = Array.from({ length: diasNoMes }, (_, i) => ({
            dia: i + 1,
            valor: mapa[i + 1]?.valor || 0,
            reservas: mapa[i + 1]?.reservas || 0
        }));

        res.json(serie);
    } catch (err) {
        console.error('Erro ao gerar série diária:', err);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// GET /api/dashboard/horarios-populares — Top 5 horários mais reservados
router.get('/horarios-populares', authenticateToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'dono') return res.status(403).json({ error: 'Apenas donos.' });

        const mes = req.query.mes || new Date().toISOString().slice(0, 7);
        const [ano, m] = mes.split('-');

        const [quadras] = await db.execute('SELECT id FROM quadras WHERE dono_id = ?', [req.user.id]);
        const quadraIds = quadras.map(q => q.id);
        if (quadraIds.length === 0) return res.json([]);

        const placeholders = quadraIds.map(() => '?').join(',');

        const [rows] = await db.execute(
            `SELECT horario_reserva as horario, COUNT(*) as count
             FROM reservas
             WHERE quadra_id IN (${placeholders})
               AND YEAR(data_reserva) = ?
               AND MONTH(data_reserva) = ?
               AND status != 'cancelada'
             GROUP BY horario_reserva
             ORDER BY count DESC
             LIMIT 5`,
            [...quadraIds, ano, parseInt(m)]
        );

        res.json(rows);
    } catch (err) {
        console.error('Erro ao calcular horários populares:', err);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

// GET /api/dashboard/clientes/:quadraId — CRM de clientes
router.get('/clientes/:quadraId', authenticateToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'dono') return res.status(403).json({ error: 'Apenas donos.' });

        const { quadraId } = req.params;
        const [quadras] = await db.execute('SELECT dono_id FROM quadras WHERE id = ?', [quadraId]);
        if (quadras.length === 0) return res.status(404).json({ error: 'Quadra não encontrada.' });
        if (quadras[0].dono_id !== req.user.id) return res.status(403).json({ error: 'Não autorizado.' });

        const [clientes] = await db.execute(
            `SELECT
                u.id,
                u.nome,
                u.telefone,
                u.foto_perfil_url as foto,
                COUNT(r.id) as total_jogos,
                MAX(r.data_reserva) as ultimo_jogo,
                SUM(CASE WHEN r.status = 'encerrada' THEN r.preco_total ELSE 0 END) as total_gasto
             FROM reservas r
             JOIN usuarios u ON u.id = r.jogador_id
             WHERE r.quadra_id = ?
               AND r.status IN ('confirmada', 'encerrada')
               AND r.jogador_id IS NOT NULL
             GROUP BY u.id, u.nome, u.telefone, u.foto_perfil_url
             ORDER BY total_jogos DESC`,
            [quadraId]
        );

        res.json(clientes.map(c => ({
            id: c.id,
            nome: c.nome,
            telefone: c.telefone || '',
            foto: c.foto,
            jogos: c.total_jogos,
            ultimoJogo: c.ultimo_jogo,
            totalGasto: parseFloat(c.total_gasto || 0).toFixed(2)
        })));
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

module.exports = router;
