import rateLimit from "express-rate-limit";

const aiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 20 requests per hour
  message: {
    message: "AI limit reached. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default aiRateLimit;
