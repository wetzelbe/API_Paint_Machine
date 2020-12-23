const http = require("http")
const serial = require("serialport")
var url = require('url');

/*serial.list().then(ports => {
	ports.forEach(function(port) {
		console.log(port.path)
		console.log(port.pnpId)
		console.log(port.manufacturer)
	})
})
*/
var filo = []
var ready = false

var portName = process.argv[2]

console.log("Serial Port in Use is: " + portName)
var port = new serial(portName, 9600)
var Readline = require('@serialport/parser-readline')
var parser = new Readline({delimiter: '\r\n'})
var pipe = port.pipe(parser)
port.on('open', () => {
	port.write("INIT\n")
	ready = true
})
pipe.on('data', d => {
	console.log("[Serial] " + d)
	if (d == "Servo up")
	{
		port.write("INIT\n")
		port.drain(error => {console.log(error)})
	}
	if (d == "-----")
		ready = true;
})
port.on('close', () => {
	console.log("Port closed")
	ready = false
})
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
	    filo.push(data)
        }
        else {
            res.writeHead(404)
            res.end()
        }
    })


}

const server = http.createServer(requestListener)
server.listen(4040)
function senddata()
{
	if (ready && filo.length > 0)
	{
	    let input = JSON.parse(filo[0])
	    filo.shift()
	    ready = false
	    if (input.Touching)
	    {
		port.write("DOWN\n")
	    }
	    else
	    {
		port.write("UP\n")
	    }
	    port.drain(error => {console.log(error)})
	    port.write("G1 X" + Math.round(input.LastknownPosition.X) + " Y" + Math.round(input.LastknownPosition.Y) + "\n")
	    port.drain(error => {console.log(error)})
	}
}
setInterval(senddata, 500)
