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

const app = express();
const port = 3000;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

const limiter = rateLimit({ windowMs: 60_000, max: 120 });
app.use("/api", limiter);

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


