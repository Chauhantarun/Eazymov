import express from "express";
import mongoose from "mongoose";
import { createServer } from "https";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import authrouter from "./router/auth.js";
import quoterouter from "./router/quote.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import fs from "fs";

dotenv.config();
const app = express();

// const privateKey = fs.readFileSync(process.env.PRI, "utf8");
// const certificate = fs.readFileSync(process.env.CIR, "utf8");

// const httpsServer = createServer(
//   {
//     key: privateKey,
//     cert: certificate,
//     minVersion: "TLSv1.2", // Specify the minimum SSL/TLS version
//   },
//   app
// );
app.use(express.json());
app.use(cors());

app.use("/api/auth", authrouter);
app.use("/api/quote", quoterouter);

const dirname = path.resolve();

app.use(express.static(path.join(dirname, "./frontend/build")));

const host = process.env.HOST || "sstcloud.in";
const proxyOptions = {
  target: `https://${host}:8089`,
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    "^/api": "/",
  },
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy error", details: err.message });
  },
};

app.use("/api", createProxyMiddleware(proxyOptions));

app.use("*", function (req, res) {
  res.sendFile(path.join(dirname, "./frontend/build/index.html"));
});

const PORT = process.env.PORT || 8089;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
