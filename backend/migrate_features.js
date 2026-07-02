const db = require('./db');

async function migrate() {
    console.log('Iniciando migração das novas features...');

    const alteracoes = [
        {
            desc: 'tipo_jogo na tabela reservas',
            sql: "ALTER TABLE reservas ADD COLUMN tipo_jogo VARCHAR(50) DEFAULT 'horario_cheio';"
        },
        {
            desc: 'jogadores_lista na tabela reservas',
            sql: "ALTER TABLE reservas ADD COLUMN jogadores_lista TEXT DEFAULT NULL;"
        },
        {
            desc: 'status_pagamento na tabela reservas',
            sql: "ALTER TABLE reservas ADD COLUMN status_pagamento VARCHAR(20) DEFAULT 'pendente';"
        }
    ];

    for (const alt of alteracoes) {
        try {
            await db.execute(alt.sql);
            console.log(`✓ Coluna adicionada: ${alt.desc}`);
        } catch (e) {
            console.log(`→ Pulado (já existe?): ${alt.desc} — ${e.message}`);
        }
    }

    console.log('Migração concluída!');
    process.exit(0);
}

migrate().catch(e => { console.error(e); process.exit(1); });
