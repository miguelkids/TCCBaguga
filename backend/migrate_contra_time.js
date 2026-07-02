const db = require('./db');

async function migrate() {
    console.log('Iniciando migração: contra_time...');

    const alteracoes = [
        {
            desc: 'nome_time na tabela reservas',
            sql: "ALTER TABLE reservas ADD COLUMN nome_time VARCHAR(100) DEFAULT NULL;"
        },
        {
            desc: 'reserva_par_id na tabela reservas',
            sql: "ALTER TABLE reservas ADD COLUMN reserva_par_id VARCHAR(36) DEFAULT NULL;"
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

    console.log('Migração contra_time concluída!');
    process.exit(0);
}

migrate().catch(e => { console.error(e); process.exit(1); });
