import pg from 'pg';
import config from './config.mjs';

const { Client } = pg;
var database = null;

async function instance() {
  if (!!database) {
    return database;
  }

  return await initialize();
}

async function initialize() {
  console.log(`Connecting to pg database "${config.sql_db}" using host "${config.sql_host}" and port "${config.sql_port}"`);

  for (var i=1; i <= 3; i++) {
    try {
      database = new Client({
        user: config.sql_user,
        password: config.sql_password,
        host: config.sql_host,
        port: config.sql_port,
        database: config.sql_db
      });

      await database.connect();

      console.log("Connected to pg database");

      return database;
    }
    catch (err) {
      console.error(`[Attempt ${i}] Connection error to pg database`, err.stack);

      if (i == 3) {
        throw err;
      }

      var delay = Math.pow(5, i) * 100;
      console.log(`Waiting for ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

var db = {
  "instance": instance
};

export default db;
