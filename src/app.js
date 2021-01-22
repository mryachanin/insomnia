import http from 'http';
import config from './config.mjs';
import db from './db.mjs';

console.log(`Starting server on host "${config.host}" and port "${config.port}"`)
http.createServer(reqHandler).listen(config.port, config.host);
console.log(`Server started`);

function reqHandler(req, res) {
    console.log(`Received request at path: ${req.url}`);
    switch (req.url) {
        case "/test":
            res.writeHead(200);
            res.write("Hi");
            res.end();
            break;
        default:
            res.writeHead(404);
            res.end("Resource not found");
    }
}
