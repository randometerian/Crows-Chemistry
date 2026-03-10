const http = require("http")
const fs = require("fs")
const path = require("path")

const PORT = Number(process.env.PORT) || 3000
const HOST = "0.0.0.0"
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8"
}

http.createServer((req,res)=>{
const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`)
const pathname = decodeURIComponent(requestUrl.pathname)
const relativePath = pathname === "/" ? "Main.html" : pathname.replace(/^\/+/, "")
const filePath = path.resolve(__dirname, relativePath)

if (!filePath.startsWith(__dirname + path.sep) && filePath !== path.join(__dirname, "Main.html")) {
res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" })
res.end("Forbidden")
return
}

fs.readFile(filePath,(err,data)=>{

if(err){
const status = err.code === "ENOENT" ? 404 : 500
res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" })
res.end(status === 404 ? "Not found" : "Internal server error")
return
}

res.writeHead(200, {
  "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream"
})
res.end(data)

})

}).listen(PORT, HOST, ()=>{

console.log(`Server running at http://${HOST}:${PORT}`)

})
