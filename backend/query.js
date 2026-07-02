const db = require('./db');
db.execute("SELECT * FROM reservas WHERE nome_time_b IS NOT NULL")
  .then(([rows]) => console.log(JSON.stringify(rows, null, 2)))
  .catch(console.error)
  .finally(() => process.exit(0));
