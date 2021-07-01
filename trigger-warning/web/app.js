import http from 'http';
import fs from 'fs';

var port = 8081;
var host = "localhost";
var index_path = "./index.html";
var functions_path = "./functions.js";

console.log(`Starting server on host [${host}] and port [${port}]`)
http.createServer(reqHandler).listen(port, host);
console.log(`Server started`);

async function reqHandler(req, res) {
    console.log(`Received request at path: ${req.url}`);

    var url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname == "/") {
        var index = fs.readFileSync(index_path, {encoding:'utf8', flag:'r'});
        res.writeHead(200);
        res.end(index);
        return;
    }

    if (url.pathname == "/functions.js") {
        var functions = fs.readFileSync(functions_path, {encoding:'utf8', flag:'r'});
        res.writeHead(200);
        res.end(functions);
        return;
    }

    res.writeHead(404);
    res.end("Resource not found");
}
