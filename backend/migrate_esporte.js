const db = require('./db');

async function migrate() {
    try {
        await db.execute(`
            ALTER TABLE quadras
            ADD COLUMN IF NOT EXISTS esporte VARCHAR(100) DEFAULT 'Futebol'
        `);
        console.log('Migration concluída: coluna esporte adicionada à tabela quadras.');
    } catch (err) {
        console.error('Erro na migration:', err.message);
    } finally {
        process.exit(0);
    }
}

migrate();
