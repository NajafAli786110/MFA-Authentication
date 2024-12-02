import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import { DbConnection } from "./services/dbConnection.js";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { UserRouter } from "./routes/UserRoute.js";
import "./services/passportConfig.js";

dotenv.config();

// DB Connection
DbConnection();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(json({ limit: "100mb" }));
app.use(urlencoded({ limit: "100mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173/",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth/", UserRouter);

app.listen(PORT, (req, res) => {
  console.log(`App is running on PORT: ${PORT}`);
});
