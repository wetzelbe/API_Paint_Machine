const http = require("http")
var url = require('url');

const requestListener = function (req, res) {
    var data = ""
    req.on('data', d => {
        data = data + d
    })
    req.on('end', () => {
        //console.log(req)
        console.log("Method: " + req.method)
        console.log("Data: " + data)
        console.log("Path: " + url.parse(req.url).pathname)
        if (url.parse(req.url).pathname == "/position" && req.method == "PUT") {
            console.log("return 200")
            res.writeHead(200)
            res.end()
        }
        else {
            res.writeHead(404)
            res.end()
        }
    })


}

const server = http.createServer(requestListener)
server.listen(4040)