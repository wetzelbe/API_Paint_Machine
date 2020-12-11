const { Console } = require("console");
const http = require("http")

const requestListener = function (req, res) {
    
    Console.log(req)

    res.writeHead(200)
    res.end()
}

const server = http.createServer(requestListener)
server.listen(4040)