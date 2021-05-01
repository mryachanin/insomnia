import assert from 'assert';
import fs from 'fs';

const CONFIG_BASE = "./config/";
const DEV_FILENAME = "dev.json";

var config_path;
var env = process.env.NODE_ENV;
console.log(`Loading config for env: ${env}`);

switch (env) {
    case "development":
        config_path = CONFIG_BASE + DEV_FILENAME;
        break;
    default:
        console.log(`Unable to load config for node env: ${env}`);
        process.exit(1);
}

console.log(`Reading config from path: ${config_path}`);
var rawConfig = fs.readFileSync(config_path, {encoding:'utf8', flag:'r'});
var config = JSON.parse(rawConfig);
console.log(`Config contents: ${JSON.stringify(config)}`);

assert.ok(config.host, `HOST is missing from config env: ${env}`);
assert.ok(config.port, `PORT is missing from config env: ${env}`);
assert.ok(config.sql_user, `SQL_USER is missing from config env: ${env}`);
assert.ok(config.sql_password, `SQL_PASSWORD is missing from config env: ${env}`);
assert.ok(config.sql_host, `SQL_HOST is missing from config env: ${env}`);
assert.ok(config.sql_port, `SQL_PORT is missing from config env: ${env}`);
assert.ok(config.sql_db, `SQL_DB is missing from config env: ${env}`);

export default config;
