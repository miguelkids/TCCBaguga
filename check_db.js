const db = require('./backend/db');
async function check() {
  const [cols] = await db.execute('SHOW COLUMNS FROM sportcourt.reservas');
  console.log(cols.map(c => `${c.Field}: ${c.Type}`));
  process.exit(0);
}
check();
