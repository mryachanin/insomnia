import http from 'http';
import config from './config.mjs';
import db from './db.mjs';
import sleep from './routes/sleep.mjs';

const database = await db.instance();

console.log(`Starting server on host "${config.host}" and port "${config.port}"`)
http.createServer(reqHandler).listen(config.port, config.host);
console.log(`Server started`);

async function reqHandler(req, res) {
    console.log(`Received request at path: ${req.url}`);

    var url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname == "/start") {
        var err = await sleep.start(database);
        if (!!err) {
            res.writeHead(err.code, err.message);
            res.end();
            return;
        }

        res.writeHead(200);
        res.end();
        return;
    }

    if (url.pathname == "/stop") {
        var err = await sleep.stop(database);
        if (!!err) {
            res.writeHead(err.code, err.message);
            res.end();
            return;
        }

        res.writeHead(200);
        res.end();
        return;
    }

    if (url.pathname == "/interrupt") {
        var err = await sleep.interrupt(database);
        if (!!err) {
            res.writeHead(err.code, err.message);
            res.end();
            return;
        }

        res.writeHead(200);
        res.end();
        return;
    }

    if (url.pathname == "/rate")
    {
        if (!url.searchParams.has('quality')) {
            res.writeHead(400);
            res.end("Expected query parameter of \"quality\" to be present");
            return;
        }

        var err = await sleep.rate(database, url.searchParams.get('quality'));
        if (!!err) {
            res.writeHead(err.code, err.message);
            res.end();
            return;
        }

        res.writeHead(200);
        res.end();
        return;
    }

    res.writeHead(404);
    res.end("Resource not found");
}
