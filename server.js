const http = require("http")
const fs = require("fs")
const path = require("path")
let Pool = null
try {
  ({ Pool } = require("pg"))
} catch (err) {
  console.warn("pg is not installed yet; observation counter will use temporary memory storage.")
}

const PORT = Number(process.env.PORT) || 3000
const HOST = "0.0.0.0"
const DATABASE_URL = process.env.DATABASE_URL || ""
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8"
}

const observationState = {
  pool: null,
  ready: false,
  failed: false,
  memoryCount: 0
}

async function ensureObservationStore() {
  if (observationState.ready || observationState.failed) return observationState.pool
  if (!DATABASE_URL || !Pool) {
    observationState.failed = true
    return null
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
  })

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_observations (
        id INTEGER PRIMARY KEY,
        count BIGINT NOT NULL
      )
    `)
    await pool.query(`
      INSERT INTO site_observations (id, count)
      VALUES (1, 0)
      ON CONFLICT (id) DO NOTHING
    `)
    observationState.pool = pool
    observationState.ready = true
    return pool
  } catch (err) {
    observationState.failed = true
    console.error("Observation store setup failed:", err)
    await pool.end().catch(() => {})
    return null
  }
}

async function recordObservation() {
  const pool = await ensureObservationStore()
  if (!pool) {
    observationState.memoryCount += 1
    return { count: observationState.memoryCount, storage: "memory" }
  }

  const result = await pool.query(`
    UPDATE site_observations
    SET count = count + 1
    WHERE id = 1
    RETURNING count
  `)
  return { count: Number(result.rows[0]?.count || 0), storage: "postgres" }
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" })
  res.end(JSON.stringify(payload))
}

function serveStaticFile(res, pathname) {
  const relativePath = pathname === "/" ? "Main.html" : pathname.replace(/^\/+/, "")
  const filePath = path.resolve(__dirname, relativePath)

  if (!filePath.startsWith(__dirname + path.sep) && filePath !== path.join(__dirname, "Main.html")) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" })
    res.end("Forbidden")
    return
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
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
}

http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`)
  const pathname = decodeURIComponent(requestUrl.pathname)

  if (req.method === "GET" && pathname === "/api/observations") {
    try {
      sendJson(res, 200, await recordObservation())
    } catch (err) {
      console.error("Observation counter failed:", err)
      sendJson(res, 500, { error: "Observation counter failed" })
    }
    return
  }

  serveStaticFile(res, pathname)
}).listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`)
})
