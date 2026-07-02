const db = require('./db');

async function migrateCampos() {
    try {
        console.log('Iniciando migração de campos secundários...');
        try {
            await db.execute('ALTER TABLE usuarios ADD COLUMN cpf VARCHAR(20), ADD COLUMN genero VARCHAR(50), ADD COLUMN data_nascimento DATE;');
            console.log('Colunas cpf, genero, data_nascimento adicionadas com sucesso.');
        } catch (e) {
            console.log('Aviso (colunas talvez já existam):', e.message);
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

migrateCampos();
