import cors from "cors";
import express from "express";
import { router as userRoutes } from "./src/routes/user.route.js";
import { router as sessionRoutes } from "./src/routes/session.route.js";
import { router as pagesRoutes } from "./src/routes/pages.route.js";
import passport from "passport";
import session from "express-session";
import morgan from "morgan";
import { isAdmin, strategy } from "./src/config/configs.js";
import { getAppTitle, updateAppTitle } from "./src/controllers/user.controller.js";

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan("dev"));
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

passport.use(strategy);

passport.serializeUser(function (user, callback) {
  callback(null, user);
});

passport.deserializeUser(function (user, callback) {
  return callback(null, user);
});

app.use(
  session({
    secret: "session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { _expires: 60000000, maxAge: 60000000 },
  })
);
app.use(passport.authenticate("session"));

app.use("/api/session", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pages", pagesRoutes);

app.put("/api/admin/title/:title", isAdmin, updateAppTitle);
app.get("/api/admin/title", getAppTitle);

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});
