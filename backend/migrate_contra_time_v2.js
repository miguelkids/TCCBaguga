const db = require('./db');

async function migrate() {
    try {
        await db.execute(`ALTER TABLE reservas ADD COLUMN IF NOT EXISTS nome_jogador_b VARCHAR(255) NULL`);
        await db.execute(`ALTER TABLE reservas ADD COLUMN IF NOT EXISTS telefone_jogador_b VARCHAR(255) NULL`);
        await db.execute(`ALTER TABLE reservas ADD COLUMN IF NOT EXISTS nome_time_b VARCHAR(255) NULL`);
        await db.execute(`ALTER TABLE reservas ADD COLUMN IF NOT EXISTS jogadores_lista_b JSON NULL`);
        console.log('Migration v2 concluída! Colunas Time B adicionadas.');
        process.exit(0);
    } catch (err) {
        console.error('Erro na migration v2:', err);
        process.exit(1);
    }
}

migrate();
