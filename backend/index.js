const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
require("module-alias/register");
require("dotenv").config();

const { errorHandler } = require("@src/middlewares/error");
const publicInvRouter = require("@src/routes/public/invitation");
const guestbookRouter = require("@src/routes/public/guestbook");
const rsvpsRouter = require("@src/routes/public/rsvp");

const kakaoRouter = require("@src/routes/auth/kakao");
const authMeRouter = require("@src/routes/auth/me");
const userRoutes = require("@src/routes/admin/user");
const meRouter = require("@src/routes/admin/me");
const aiRouter = require("@src/routes/ai/recommend");

// JWT_SECRET 유효성 검사
if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error("FATAL: JWT_SECRET, JWT_REFRESH_SECRET 환경변수가 설정되지 않았습니다.");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://t1.kakaocdn.net", "https://developers.kakao.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", ...allowedOrigins, "https://kauth.kakao.com", "https://kapi.kakao.com"],
        fontSrc: ["'self'", "https:", "data:"],
        frameSrc: ["'self'", "https://developers.kakao.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

// 일반 API rate limiting (분당 120회)
const apiLimiter = rateLimit({ windowMs: 60_000, max: 120 });
app.use("/api", apiLimiter);

// 인증 엔드포인트 강화 rate limiting (분당 10회)
const authLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  message: { success: false, message: "인증 요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
});
app.use("/api/auth/user/login", authLimiter);
app.use("/api/auth/user/signup", authLimiter);

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/public/invitations", publicInvRouter);
app.use("/api/guestbook", guestbookRouter);
app.use("/api/rsvps", rsvpsRouter);

app.use("/api/auth/kakao", kakaoRouter);
app.use("/api/auth/me", authMeRouter);
app.use("/api/auth/user", userRoutes);

app.use("/api/admin", meRouter);
app.use("/api/ai", aiRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`API http://localhost:${port}`);
});
