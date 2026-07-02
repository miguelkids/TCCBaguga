const db = require('./db');

async function fix() {
    try {
        console.log("Fixing missing data in reservas...");
        
        // Fix nome_jogador_b if missing
        await db.execute(`
            UPDATE reservas 
            SET nome_jogador_b = JSON_UNQUOTE(JSON_EXTRACT(jogadores_lista_b, '$[0].nome'))
            WHERE tipo_jogo = 'contra_time' 
              AND nome_jogador_b IS NULL 
              AND jogadores_lista_b IS NOT NULL
        `);
        
        // Link jogador_id_b to users based on name
        const [users] = await db.execute('SELECT id, nome FROM usuarios');
        for (const user of users) {
            await db.execute(`
                UPDATE reservas 
                SET jogador_id_b = ? 
                WHERE tipo_jogo = 'contra_time' 
                  AND (nome_jogador_b = ? OR JSON_UNQUOTE(JSON_EXTRACT(jogadores_lista_b, '$[0].nome')) = ?)
                  AND jogador_id_b IS NULL
            `, [user.id, user.nome, user.nome]);
        }
        
        // Also fix the 'yuri' entry if yuri exists
        const [yuriUsers] = await db.execute('SELECT id FROM usuarios WHERE nome LIKE "%yuri%" OR nome_usuario LIKE "%yuri%"');
        if (yuriUsers.length > 0) {
            await db.execute('UPDATE reservas SET jogador_id_b = ? WHERE nome_jogador_b = "yuri"', [yuriUsers[0].id]);
        }

        console.log("Fix complete.");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

fix();
