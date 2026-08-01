const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const jwt = require('jsonwebtoken');

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

// Criar reserva
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { quadraId, nomeJogador, telefoneJogador, data, dataReserva, horario, horarioReserva, tipoJogo, jogadoresLista, nomeTime } = req.body;
        const dataFinal = data || dataReserva;
        const horarioFinal = horario || horarioReserva;
        console.log('[RESERVA] Recebido:', { quadraId, nomeJogador, dataFinal, horarioFinal, tipoJogo, nomeTime });

        if (!quadraId || !dataFinal || !horarioFinal) {
            return res.status(400).json({ error: 'Quadra, data e horário são obrigatórios para realizar a reserva.' });
        }

        const id = uuidv4();
        const jogador_id = req.user ? req.user.id : null;

        // jogadoresLista chega como array de strings com nomes
        const jogadoresJson = jogadoresLista && jogadoresLista.length > 0
            ? JSON.stringify(jogadoresLista.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return {
                        nome: item.nome || '',
                        pago: item.pago || false,
                        goleiro: !!item.goleiro,
                        goleiroPaga: item.goleiroPaga !== undefined ? !!item.goleiroPaga : true
                    };
                }
                return { nome: item, pago: false, goleiro: false, goleiroPaga: true };
            }))
            : null;

        await db.execute(
            `INSERT INTO reservas (id, quadra_id, jogador_id, nome_jogador, telefone_jogador, data_reserva, horario_reserva, tipo_jogo, jogadores_lista, nome_time)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, quadraId, jogador_id, nomeJogador, telefoneJogador, dataFinal, horarioFinal, tipoJogo || 'horario_cheio', jogadoresJson, nomeTime || null]
        );

        res.status(201).json({ message: 'Reserva criada com sucesso!', id });
    } catch (err) {
        console.error('Erro ao criar reserva:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Consultar TODOS os slots contra_time aguardando adversário em um dia (batch — 1 query)
router.get('/contra-time-aguardando-dia', authenticateToken, async (req, res) => {
    try {
        const { quadraId, data } = req.query;
        if (!quadraId || !data) {
            return res.status(400).json({ error: 'quadraId e data são obrigatórios.' });
        }

        const [rows] = await db.execute(
            `SELECT id, nome_jogador, nome_time, horario_reserva as horario FROM reservas
             WHERE quadra_id = ? AND data_reserva = ?
               AND tipo_jogo = 'contra_time' AND confirmada = FALSE AND nome_time_b IS NULL`,
            [quadraId, data]
        );

        // Retorna mapa: { "10:00": { reservaId, nomeTime }, ... }
        const slots = {};
        rows.forEach(r => {
            slots[r.horario] = {
                reservaId: r.id,
                nomeTime: r.nome_time || r.nome_jogador
            };
        });

        res.json({ slots });
    } catch (err) {
        console.error('Erro ao consultar contra_time aguardando (dia):', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Consultar slot contra_time aguardando adversário (horário específico — mantido por compatibilidade)
router.get('/contra-time-aguardando', authenticateToken, async (req, res) => {
    try {
        const { quadraId, data, horario } = req.query;
        if (!quadraId || !data || !horario) {
            return res.status(400).json({ error: 'quadraId, data e horario são obrigatórios.' });
        }

        const [rows] = await db.execute(
            `SELECT id, nome_jogador, nome_time FROM reservas
             WHERE quadra_id = ? AND data_reserva = ? AND horario_reserva = ?
               AND tipo_jogo = 'contra_time' AND confirmada = FALSE AND nome_time_b IS NULL`,
            [quadraId, data, horario]
        );

        if (rows.length === 0) {
            return res.json({ aguardando: false });
        }

        const r = rows[0];
        res.json({
            aguardando: true,
            reservaId: r.id,
            nomeTime: r.nome_time || r.nome_jogador
        });
    } catch (err) {
        console.error('Erro ao consultar contra_time aguardando:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Listar reservas (para dono ou jogador)
router.get('/', authenticateToken, async (req, res) => {
    try {
        let reservas = [];
        
        if (req.user.tipo === 'dono') {
            const [rows] = await db.execute(
                `SELECT r.*, q.nome as quadraNome, q.endereco as quadraEndereco, q.foto_url as fotoUrl, q.telefone as quadraTelefone, q.media_avaliacao as media, q.preco as precoQuadra, q.esporte as quadraEsporte,
                        (SELECT COUNT(*) FROM avaliacoes WHERE quadra_id = q.id) as totalAvaliacoes
                 FROM reservas r
                 JOIN quadras q ON r.quadra_id = q.id
                 WHERE q.dono_id = ?`,
                [req.user.id]
            );
            reservas = rows;
        } else {
            const [rows] = await db.execute(
                `SELECT r.*, q.nome as quadraNome, q.endereco as quadraEndereco, q.foto_url as fotoUrl, q.telefone as quadraTelefone, q.media_avaliacao as media, q.preco as precoQuadra, q.esporte as quadraEsporte,
                        a.estrelas as notaUsuario,
                        (SELECT COUNT(*) FROM avaliacoes WHERE quadra_id = q.id) as totalAvaliacoes
                 FROM reservas r
                 JOIN quadras q ON r.quadra_id = q.id
                 LEFT JOIN avaliacoes a ON a.quadra_id = q.id AND a.usuario_id = ?
                  WHERE (r.jogador_id = ? AND (r.reserva_par_id IS NULL OR r.confirmada = TRUE)) OR r.jogador_id_b = ?`,
                [req.user.id, req.user.id, req.user.id]
            );
            reservas = rows;
        }

        const formatadas = reservas.map(r => {
            let jogadoresParsed = [];
            try {
                if (r.jogadores_lista) jogadoresParsed = JSON.parse(r.jogadores_lista);
            } catch (_) { jogadoresParsed = []; }

            let jogadoresListaB = [];
            try {
                if (r.jogadores_lista_b) jogadoresListaB = JSON.parse(r.jogadores_lista_b);
            } catch (_) { jogadoresListaB = []; }

            return {
                id: r.id,
                quadraId: r.quadra_id,
                jogadorId: r.jogador_id,
                nome: r.nome_jogador,
                telefone: r.telefone_jogador,
                data: r.data_reserva,
                horario: r.horario_reserva,
                confirmada: r.confirmada,
                preco: r.precoQuadra,
                quadraNome: r.quadraNome,
                endereco: r.quadraEndereco,
                fotoPreview: r.fotoUrl,
                quadraTelefone: r.quadraTelefone,
                media: r.media,
                avaliado: r.notaUsuario !== null && r.notaUsuario !== undefined,
                nota: r.notaUsuario || 0,
                totalAvaliacoes: r.totalAvaliacoes || 0,
                tipoJogo: r.tipo_jogo || 'horario_cheio',
                jogadoresLista: jogadoresParsed,
                statusPagamento: r.status_pagamento || 'pendente',
                nomeTime: r.nome_time || null,
                nomeTimeB: r.nome_time_b || null,
                nomeJogadorB: r.nome_jogador_b || null,
                telefoneJogadorB: r.telefone_jogador_b || null,
                jogadoresListaB: jogadoresListaB,
                jogadorIdB: r.jogador_id_b || null,
                quadraEsporte: r.quadraEsporte || 'Futebol'
            };
        });

        res.json(formatadas);
    } catch (err) {
        console.error('Erro ao listar reservas:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Confirmar reserva (dono)
router.put('/:id/confirmar', authenticateToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'dono') {
            return res.status(403).json({ error: 'Apenas donos podem confirmar reservas.' });
        }

        const { id } = req.params;

        const [rows] = await db.execute(
            `SELECT r.id, r.reserva_par_id, q.dono_id, q.preco FROM reservas r JOIN quadras q ON r.quadra_id = q.id WHERE r.id = ?`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Reserva não encontrada.' });
        if (rows[0].dono_id !== req.user.id) return res.status(403).json({ error: 'Não autorizado.' });

        await db.execute('UPDATE reservas SET confirmada = TRUE WHERE id = ?', [id]);

        // Se for contra_time proposta vinculada, deleta a original e as concorrentes
        if (rows[0].reserva_par_id) {
            const parId = rows[0].reserva_par_id;
            await db.execute(
                `DELETE FROM reservas WHERE (id = ? OR reserva_par_id = ?) AND id != ?`,
                [parId, parId, id]
            );
        }

        // Bloqueia o horário automaticamente
        const [reservaInfo] = await db.execute(
            'SELECT quadra_id, data_reserva, horario_reserva FROM reservas WHERE id = ?',
            [id]
        );
        if (reservaInfo.length > 0) {
            const { quadra_id, data_reserva, horario_reserva } = reservaInfo[0];
            const dataStr = data_reserva instanceof Date
                ? data_reserva.toISOString().slice(0, 10)
                : String(data_reserva).slice(0, 10);
            const [existente] = await db.execute(
                'SELECT id FROM horarios_ocupados WHERE quadra_id = ? AND data_ocupada = ? AND horario_ocupado = ?',
                [quadra_id, dataStr, horario_reserva]
            );
            if (existente.length === 0) {
                await db.execute(
                    'INSERT INTO horarios_ocupados (quadra_id, data_ocupada, horario_ocupado) VALUES (?, ?, ?)',
                    [quadra_id, dataStr, horario_reserva]
                );
            }
        }

        const preco = Number(rows[0].preco || 0);
        res.json({ message: 'Reserva confirmada!', preco });
    } catch (err) {
        console.error('Erro ao confirmar reserva:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Entrar como adversário em uma reserva contra_time
router.post('/:id/entrar-contra-time', authenticateToken, async (req, res) => {
    try {
        const { id: reservaOriginalId } = req.params;
        const { nomeJogador, telefoneJogador, jogadoresLista, nomeTime } = req.body;

        // Busca todos os dados da reserva original
        const [rows] = await db.execute(
            `SELECT * FROM reservas WHERE id = ?`,
            [reservaOriginalId]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Reserva não encontrada.' });
        const original = rows[0];

        const jogadoresJson = jogadoresLista && jogadoresLista.length > 0
            ? JSON.stringify(jogadoresLista.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return {
                        nome: item.nome || '',
                        pago: item.pago || false,
                        goleiro: !!item.goleiro,
                        goleiroPaga: item.goleiroPaga !== undefined ? !!item.goleiroPaga : true
                    };
                }
                return { nome: item, pago: false, goleiro: false, goleiroPaga: true };
            }))
            : null;

        const jogador_id_b = req.user ? req.user.id : null;
        console.log('[ENTRAR CONTRA TIME] Inserindo proposta vinculada à original:', reservaOriginalId, 'com desafiante B:', jogador_id_b);

        const idNovaProposta = uuidv4();

        // Insere a nova proposta clonando os dados do Time A e adicionando o Time B
        await db.execute(
            `INSERT INTO reservas (
                id, quadra_id, jogador_id, nome_jogador, telefone_jogador, nome_time, jogadores_lista,
                data_reserva, horario_reserva, tipo_jogo, confirmada, status_pagamento,
                reserva_par_id, jogador_id_b, nome_jogador_b, telefone_jogador_b, nome_time_b, jogadores_lista_b
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'contra_time', FALSE, 'pendente', ?, ?, ?, ?, ?, ?)`,
            [
                idNovaProposta,
                original.quadra_id,
                original.jogador_id,
                original.nome_jogador,
                original.telefone_jogador,
                original.nome_time,
                original.jogadores_lista,
                original.data_reserva,
                original.horario_reserva,
                original.id, // reserva_par_id
                jogador_id_b,
                nomeJogador,
                telefoneJogador,
                nomeTime || nomeJogador,
                jogadoresJson
            ]
        );

        res.json({ message: 'Você entrou na partida! Aguarde confirmação do dono.', id: idNovaProposta });
    } catch (err) {
        console.error('Erro ao entrar contra_time:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Atualizar lista de jogadores (dono — apenas reservas confirmadas)
router.put('/:id/jogadores', authenticateToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'dono') {
            return res.status(403).json({ error: 'Apenas donos podem editar a lista.' });
        }

        const { id } = req.params;
        const { jogadoresLista, jogadoresListaB } = req.body;

        // Normaliza cada item da lista para garantir tipos corretos
        const normalizarLista = (lista) => {
            if (!Array.isArray(lista)) return [];
            return lista.map(item => {
                if (typeof item === 'string') {
                    try { item = JSON.parse(item); } catch { return { nome: item, pago: false, goleiro: false, goleiroPaga: true }; }
                }
                return {
                    nome: item.nome || '',
                    pago: !!item.pago,
                    goleiro: !!item.goleiro,
                    goleiroPaga: item.goleiroPaga !== undefined ? !!item.goleiroPaga : true
                };
            });
        };

        const listaA = normalizarLista(jogadoresLista);
        const listaB = normalizarLista(jogadoresListaB);

        // Verifica propriedade e que a reserva está confirmada
        const [rows] = await db.execute(
            `SELECT r.id, r.confirmada, q.dono_id FROM reservas r JOIN quadras q ON r.quadra_id = q.id WHERE r.id = ?`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Reserva não encontrada.' });
        if (rows[0].dono_id !== req.user.id) return res.status(403).json({ error: 'Não autorizado.' });

        await db.execute(
            'UPDATE reservas SET jogadores_lista = ?, jogadores_lista_b = ? WHERE id = ?',
            [JSON.stringify(listaA), JSON.stringify(listaB), id]
        );

        res.json({ message: 'Lista de jogadores atualizada!', jogadoresLista: listaA, jogadoresListaB: listaB });
    } catch (err) {
        console.error('Erro ao atualizar lista de jogadores:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Atualizar status de pagamento de uma reserva (dono)
router.put('/:id/status-pagamento', authenticateToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'dono') {
            return res.status(403).json({ error: 'Apenas donos podem alterar pagamentos.' });
        }

        const { id } = req.params;
        const { statusPagamento } = req.body;

        if (!['pago', 'pendente'].includes(statusPagamento)) {
            return res.status(400).json({ error: 'Status inválido. Use "pago" ou "pendente".' });
        }

        const [rows] = await db.execute(
            `SELECT r.id, r.confirmada, q.dono_id, q.preco FROM reservas r JOIN quadras q ON r.quadra_id = q.id WHERE r.id = ?`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Reserva não encontrada.' });
        if (rows[0].dono_id !== req.user.id) return res.status(403).json({ error: 'Não autorizado.' });

        const [reservaAtual] = await db.execute('SELECT status_pagamento FROM reservas WHERE id = ?', [id]);
        const statusAnterior = reservaAtual[0].status_pagamento || 'pendente';

        await db.execute('UPDATE reservas SET status_pagamento = ? WHERE id = ?', [statusPagamento, id]);

        // Atualiza faturamento do dono ao marcar como pago
        const preco = Number(rows[0].preco || 0);
        if (statusPagamento === 'pago' && statusAnterior !== 'pago' && rows[0].confirmada) {
            await db.execute(
                'UPDATE usuarios SET faturamento_total = faturamento_total + ? WHERE id = ?',
                [preco, req.user.id]
            );
        } else if (statusPagamento === 'pendente' && statusAnterior === 'pago' && rows[0].confirmada) {
            await db.execute(
                'UPDATE usuarios SET faturamento_total = GREATEST(0, faturamento_total - ?) WHERE id = ?',
                [preco, req.user.id]
            );
        }

        res.json({ message: 'Status de pagamento atualizado!', statusPagamento });
    } catch (err) {
        console.error('Erro ao atualizar status de pagamento:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Concluir/encerrar reserva (dono)
router.put('/:id/concluir', authenticateToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'dono') {
            return res.status(403).json({ error: 'Apenas donos podem encerrar horários.' });
        }

        const { id } = req.params;

        const [rows] = await db.execute(
            `SELECT r.id, r.confirmada, r.status_pagamento, q.dono_id, q.preco FROM reservas r JOIN quadras q ON r.quadra_id = q.id WHERE r.id = ?`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Reserva não encontrada.' });
        if (rows[0].dono_id !== req.user.id) return res.status(403).json({ error: 'Não autorizado.' });

        const reserva = rows[0];
        const statusAnteriorPgto = reserva.status_pagamento || 'pendente';

        // Atualiza para concluída e paga
        await db.execute('UPDATE reservas SET confirmada = TRUE, status_pagamento = "pago" WHERE id = ?', [id]);

        // Se o pagamento mudou para pago, atualiza o faturamento do dono
        const preco = Number(reserva.preco || 0);
        if (statusAnteriorPgto !== 'pago') {
            await db.execute(
                'UPDATE usuarios SET faturamento_total = faturamento_total + ? WHERE id = ?',
                [preco, req.user.id]
            );
        }

        res.json({ message: 'Horário encerrado e pagamento registrado com sucesso!', statusPagamento: 'pago' });
    } catch (err) {
        console.error('Erro ao concluir reserva:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Editar informações do jogador na reserva
router.put('/:id/editar-jogador', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, telefone, nomeTime, jogadoresLista } = req.body;

        const [rows] = await db.execute(
            `SELECT r.id, r.jogador_id, r.jogador_id_b, r.tipo_jogo FROM reservas r WHERE r.id = ?`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Reserva não encontrada.' });

        const reserva = rows[0];
        const isJogadorA = reserva.jogador_id === req.user.id;
        const isJogadorB = reserva.jogador_id_b === req.user.id;

        if (!isJogadorA && !isJogadorB) return res.status(403).json({ error: 'Não autorizado.' });

        const jogadoresJson = jogadoresLista && jogadoresLista.length > 0
            ? JSON.stringify(jogadoresLista.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return {
                        nome: item.nome || '',
                        pago: item.pago || false,
                        goleiro: !!item.goleiro,
                        goleiroPaga: item.goleiroPaga !== undefined ? !!item.goleiroPaga : true
                    };
                }
                return { nome: item, pago: false, goleiro: false, goleiroPaga: true };
            }))
            : null;

        if (isJogadorB) {
            await db.execute(
                'UPDATE reservas SET nome_jogador_b = ?, telefone_jogador_b = ?, nome_time_b = ?, jogadores_lista_b = ? WHERE id = ?',
                [nome || null, telefone || null, nomeTime || null, jogadoresJson, id]
            );
        } else {
            await db.execute(
                'UPDATE reservas SET nome_jogador = ?, telefone_jogador = ?, nome_time = ?, jogadores_lista = ? WHERE id = ?',
                [nome || null, telefone || null, nomeTime || null, jogadoresJson, id]
            );
        }

        res.json({ message: 'Informações atualizadas com sucesso!' });
    } catch (err) {
        console.error('Erro ao editar reserva:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Mudar tipo de jogo (dono: contra_time <-> horario_cheio)
router.put('/:id/tipo-jogo', authenticateToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'dono') {
            return res.status(403).json({ error: 'Apenas donos podem alterar o tipo de jogo.' });
        }
        const { id } = req.params;
        const { tipoJogo } = req.body;
        if (!['horario_cheio', 'contra_time'].includes(tipoJogo)) {
            return res.status(400).json({ error: 'Tipo inválido.' });
        }
        const [rows] = await db.execute(
            `SELECT r.id, q.dono_id FROM reservas r JOIN quadras q ON r.quadra_id = q.id WHERE r.id = ?`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Reserva não encontrada.' });
        if (rows[0].dono_id !== req.user.id) return res.status(403).json({ error: 'Não autorizado.' });
        if (tipoJogo === 'horario_cheio') {
            await db.execute(
                `UPDATE reservas SET tipo_jogo = ?, nome_jogador_b = NULL, telefone_jogador_b = NULL, nome_time_b = NULL, jogadores_lista_b = NULL, jogador_id_b = NULL WHERE id = ?`,
                [tipoJogo, id]
            );
        } else {
            await db.execute('UPDATE reservas SET tipo_jogo = ? WHERE id = ?', [tipoJogo, id]);
        }
        res.json({ message: 'Tipo de jogo atualizado!', tipoJogo });
    } catch (err) {
        console.error('Erro ao atualizar tipo de jogo:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Cancelar/deletar reserva
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.execute(
            `SELECT r.id, r.confirmada, r.status_pagamento, r.quadra_id, r.data_reserva, r.horario_reserva, r.tipo_jogo, r.reserva_par_id, q.dono_id, q.preco, r.jogador_id, r.jogador_id_b FROM reservas r JOIN quadras q ON r.quadra_id = q.id WHERE r.id = ?`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Reserva não encontrada.' });

        const reserva = rows[0];
        const isDono = req.user.tipo === 'dono' && reserva.dono_id === req.user.id;
        const isJogadorA = req.user.tipo === 'jogador' && reserva.jogador_id === req.user.id;
        const isJogadorB = req.user.tipo === 'jogador' && reserva.jogador_id_b === req.user.id;

        if (!isDono && !isJogadorA && !isJogadorB) return res.status(403).json({ error: 'Não autorizado.' });

        // Reserva confirmada: apenas o dono pode cancelar
        if (reserva.confirmada && !isDono) {
            return res.status(403).json({ error: 'Reserva já confirmada. Apenas o dono pode cancelar.' });
        }

        // Jogador B cancela proposta pendente contra_time: deleta apenas sua proposta
        if (isJogadorB && !reserva.confirmada && reserva.tipo_jogo === 'contra_time') {
            await db.execute('DELETE FROM reservas WHERE id = ?', [id]);
            return res.json({ message: 'Você saiu da partida com sucesso!', saiuTimeB: true });
        }

        // Se estava paga e é o dono cancelando, reverte o faturamento
        if (reserva.status_pagamento === 'pago' && isDono) {
            const preco = Number(reserva.preco || 0);
            await db.execute(
                'UPDATE usuarios SET faturamento_total = GREATEST(0, faturamento_total - ?) WHERE id = ?',
                [preco, reserva.dono_id]
            );
        }

        // Se a reserva estava confirmada, libera o horário em horarios_ocupados
        if (reserva.confirmada) {
            const dataStr = reserva.data_reserva instanceof Date
                ? reserva.data_reserva.toISOString().slice(0, 10)
                : String(reserva.data_reserva).slice(0, 10);
            await db.execute(
                'DELETE FROM horarios_ocupados WHERE quadra_id = ? AND data_ocupada = ? AND horario_ocupado = ?',
                [reserva.quadra_id, dataStr, reserva.horario_reserva]
            );
        }

        // Se for a reserva original (sem par), deleta ela e todas as propostas vinculadas
        if (!reserva.reserva_par_id) {
            await db.execute('DELETE FROM reservas WHERE id = ? OR reserva_par_id = ?', [id, id]);
        } else {
            await db.execute('DELETE FROM reservas WHERE id = ?', [id]);
        }

        res.json({ message: 'Reserva cancelada com sucesso!' });
    } catch (err) {
        console.error('Erro ao cancelar reserva:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = router;
