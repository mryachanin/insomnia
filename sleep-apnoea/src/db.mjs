import pg from 'pg';
import config from './config.mjs';

const { Client } = pg;

console.log(`Connecting to pg database "${config.sql_db}" using host "${config.sql_host}" and port "${config.sql_port}"`);
const db = new Client({
    user: config.sql_user,
    password: config.sql_password,
    host: config.sql_host,
    port: config.sql_port,
    database: config.sql_db
});
await db.connect(err => {
    if (err) {
      console.error('Connection error to pg database', err.stack);
    } else {
      console.log('Connected to pg database');
    }
  });

export default db;
