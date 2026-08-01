// migrate_v2.js — Migração do banco para suportar as novas funcionalidades
require('dotenv').config();
const db = require('./db');

async function migrate() {
    console.log('🚀 Iniciando migração v2...');

    const columnsToAdd = [
        { table: 'quadras', column: 'horario_abertura', type: "VARCHAR(10) DEFAULT '08:00'" },
        { table: 'quadras', column: 'horario_fechamento', type: "VARCHAR(10) DEFAULT '22:00'" },
        { table: 'quadras', column: 'descricao_extra', type: "TEXT" },
        { table: 'quadras', column: 'mensalista_msg', type: "TEXT" },
        { table: 'quadras', column: 'politica_cancelamento', type: "TEXT" },
        { table: 'quadras', column: 'dias_funcionamento', type: "VARCHAR(100) DEFAULT 'seg,ter,qua,qui,sex,sab'" },
        { table: 'quadras', column: 'esportes_lista', type: "TEXT" },
        { table: 'reservas', column: 'status', type: "ENUM('pendente','confirmada','encerrada','cancelada') DEFAULT 'pendente'" },
        { table: 'reservas', column: 'preco_total', type: "DECIMAL(10,2) DEFAULT 0.00" },
        { table: 'horarios_ocupados', column: 'descricao', type: "VARCHAR(255)" },
        { table: 'datas_ocupadas', column: 'descricao', type: "VARCHAR(255)" },
    ];

    for (const col of columnsToAdd) {
        try {
            await db.execute(`ALTER TABLE ${col.table} ADD COLUMN ${col.column} ${col.type}`);
            console.log(`  ✅ Adicionou ${col.table}.${col.column}`);
        } catch (err) {
            console.log(`  ℹ️ Coluna ${col.table}.${col.column}: ${err.message}`);
        }
    }

    const tablesToCreate = [
        {
            name: 'anuncios_quadra',
            sql: `CREATE TABLE IF NOT EXISTS anuncios_quadra (
                id VARCHAR(128) PRIMARY KEY,
                quadra_id VARCHAR(128) NOT NULL,
                titulo VARCHAR(255),
                corpo TEXT,
                tom ENUM('info','warning','success') DEFAULT 'info',
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (quadra_id) REFERENCES quadras(id) ON DELETE CASCADE
            )`
        },
        {
            name: 'mensagens',
            sql: `CREATE TABLE IF NOT EXISTS mensagens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                quadra_id VARCHAR(128) NOT NULL,
                remetente_id VARCHAR(128) NOT NULL,
                tipo_remetente ENUM('dono','jogador') NOT NULL,
                autor_nome VARCHAR(255),
                texto TEXT NOT NULL,
                lida_dono BOOLEAN DEFAULT FALSE,
                lida_jogador BOOLEAN DEFAULT FALSE,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (quadra_id) REFERENCES quadras(id) ON DELETE CASCADE,
                FOREIGN KEY (remetente_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )`
        },
        {
            name: 'subcontas',
            sql: `CREATE TABLE IF NOT EXISTS subcontas (
                id VARCHAR(128) PRIMARY KEY,
                quadra_id VARCHAR(128) NOT NULL,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                senha_hash VARCHAR(255) NOT NULL,
                cargo VARCHAR(100),
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (quadra_id) REFERENCES quadras(id) ON DELETE CASCADE
            )`
        }
    ];

    for (const item of tablesToCreate) {
        try {
            await db.execute(item.sql);
            console.log(`  ✅ Tabela ${item.name} pronta.`);
        } catch (err) {
            console.error(`  ❌ Erro em ${item.name}: ${err.message}`);
        }
    }

    try {
        await db.execute(`UPDATE reservas SET status = 'confirmada' WHERE confirmada = TRUE AND (status IS NULL OR status = 'pendente')`);
    } catch (e) {}

    console.log('\n✅ Fim do processo de migração!');
    process.exit(0);
}

migrate().catch(err => {
    console.error('❌ Falha crítica na migração:', err);
    process.exit(1);
});
