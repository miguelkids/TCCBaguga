const db = require('./db');

async function migrate() {
    try {
        console.log('Iniciando migração...');
        // Ignora erro se a coluna já existir (em MySQL < 8.0 pode dar erro sem check, mas a gente contorna)
        try {
            await db.execute('ALTER TABLE usuarios ADD COLUMN foto_perfil_url VARCHAR(255);');
            console.log('Coluna foto_perfil_url adicionada com sucesso.');
        } catch (e) {
            console.log('Possível erro (coluna talvez já exista):', e.message);
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

migrate();
