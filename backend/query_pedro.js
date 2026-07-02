const db = require('./db');
db.execute("SELECT id, nome_jogador, nome_jogador_b, nome_time, nome_time_b, jogadores_lista, jogadores_lista_b FROM reservas WHERE nome_jogador LIKE '%pedro%' OR nome_jogador_b LIKE '%pedro%' OR nome_time LIKE '%farroupilha%' OR nome_time_b LIKE '%farroupilha%'")
  .then(([rows]) => console.log(JSON.stringify(rows, null, 2)))
  .catch(console.error)
  .finally(() => process.exit(0));
