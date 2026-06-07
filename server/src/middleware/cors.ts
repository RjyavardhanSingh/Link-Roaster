import cors from "cors"
import Origin from "../models/origins"

let cachedOrigins: string[] = []
let lastFetched: number | null = null
const CACHE_TTL = 5 * 60 * 1000

const getOrigins = async (): Promise<string[]> => {
    const now = Date.now()

    if(lastFetched && now-lastFetched < CACHE_TTL){
        return cachedOrigins
    }
    const doc = await Origin.find({},"origin")
    cachedOrigins = doc.map((d) => d.origin)

    lastFetched = now
    return cachedOrigins
}

const dynamicCors = cors({
  origin: async (origin: any, callback: any) => {
    try {
      // Postman / Thunder Client ke liye origin nahi hota
      if (!origin) return callback(null, true);

      const origins = await getOrigins();

      if (origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: Origin not allowed"));
      }
    } catch (err) {
      callback(err as Error);
    }
  },
  methods: ["GET", "POST"],
  credentials: false,
});

export default dynamicCors;