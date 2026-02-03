import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();

// Respect proxy headers on Render (needed for secure cookies + correct req.protocol)
app.set("trust proxy", 1);

// basic configurations
app.use(express.json({limit : "16kb"})) // middleware(app.use()) // 16kb of json data will be taken
app.use(express.urlencoded({extended: true, limit : "16kb"}))//accepting data from url
app.use(express.static("public")) // public part will be vidible to all

app.use(cookieParser());

// CORS configuration
const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const origins = allowedOrigins.length ? allowedOrigins : defaultOrigins;
      if (origins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// import routes

import  healthCheckRouter from "./routes/healthcheck.routes.js" // default export

import authRouter from "./routes/auth.routes.js"
app.use("/api/v1/healthCheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
import articleRouter from "./routes/article.routes.js"
app.use("/api/v1/blogs",articleRouter)
// take a obj
app.get("/",(req,res)=>{
    res.send("Welcome to Basecampy");
})
export default app;
