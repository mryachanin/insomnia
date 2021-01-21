import http from 'http';

const PORT = 8080;

http.createServer(reqHandler).listen(PORT);
console.log(`Server started on port: ${PORT}`);

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
