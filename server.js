const http = require("http")
const fs = require("fs")
const path = require("path")

const PORT = 3000
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8"
}

http.createServer((req,res)=>{

let file = req.url === "/" ? "Main.html" : decodeURIComponent(req.url)

let filePath = path.join(__dirname,file)

fs.readFile(filePath,(err,data)=>{

if(err){
res.writeHead(404)
res.end("Not found")
return
}

res.writeHead(200, {
  "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream"
})
res.end(data)

})

}).listen(PORT,()=>{

console.log("Server running at http://localhost:" + PORT)

})
