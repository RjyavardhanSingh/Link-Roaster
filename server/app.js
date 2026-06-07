import express from "express";
import connectDB from "./src/config/originDB";
import { prisma } from "./src/config/supabaseConnector";
import dynamicCors from "./src/middleware/cors";
import roastRoutes from "./src/routes/roastRoutes";

const app = express();

connectDB();

app.use(dynamicCors);
app.use(express.json());

(async () => {
  await prisma.$connect();
  console.log("Supabase connected");
})();

app.get("/", (req, res) => {
  res.send({ msg: "Server is Active" });
});

app.use("/api", roastRoutes);

export default app;
