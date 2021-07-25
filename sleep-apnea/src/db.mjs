import pg from 'pg';
import config from './config.mjs';

const { Client } = pg;
var database = null;

function instance() {
  if (!!database) {
    return database;
  }

  return initialize();
}

async function initialize() {
  console.log(`Connecting to pg database "${config.sql_db}" using host "${config.sql_host}" and port "${config.sql_port}"`);
  database = new Client({
      user: config.sql_user,
      password: config.sql_password,
      host: config.sql_host,
      port: config.sql_port,
      database: config.sql_db
  });
  await database.connect(err => {
      if (!!err) {
        console.error('Connection error to pg database', err.stack);
        throw err;
      } else {
        console.log('Connected to pg database');
      }
  });
}

var db = {
  "instance": instance
};

export default db;
