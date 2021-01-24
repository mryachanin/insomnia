import http from 'http';
import config from './config.mjs';
import sleep from './routes/sleep.mjs';

console.log(`Starting server on host "${config.host}" and port "${config.port}"`)
http.createServer(reqHandler).listen(config.port, config.host);
console.log(`Server started`);

async function reqHandler(req, res) {
    console.log(`Received request at path: ${req.url}`);

    var url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname == "/start") {
        var err = await sleep.start();
        if (!!err) {
            res.writeHead(err.code);
            res.end(err.message);
            return;
        }

        res.writeHead(200);
        res.end();
        return;
    }

    if (url.pathname == "/stop") {
        var err = await sleep.stop();
        if (!!err) {
            res.writeHead(err.code);
            res.end(err.message);
            return;
        }

        res.writeHead(200);
        res.end();
        return;
    }

    if (url.pathname == "/interrupt") {
        sleep.interrupt();
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

        sleep.rate(url.searchParams.get('quality'));
        res.writeHead(200);
        res.end();
        return;
    }

    res.writeHead(404);
    res.end("Resource not found");
}
