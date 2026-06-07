import cors from "cors"
import Origin from "../models/origins"

let allowedOrigins: string[] = []
let lastFetched = 0
const CACHE_TTL = 30_000

async function refreshOrigins() {
  try {
    const docs = await Origin.find({}, "origin")
    allowedOrigins = docs.map(d => d.origin)
    lastFetched = Date.now()
  } catch (err) {
    console.error("Failed to fetch CORS origins from MongoDB:", err)
  }
}

refreshOrigins()
setInterval(refreshOrigins, CACHE_TTL)

const dynamicCors = cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("CORS: Origin not allowed"))
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
})

export default dynamicCors
