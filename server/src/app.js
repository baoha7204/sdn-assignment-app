import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import { currentUser, errorHandler } from "@bhtickix/common";

import authRouter from "./routes/auth.route.js";
import usersRouter from "./routes/users.route.js";
import brandsRouter from "./routes/brands.route.js";
import perfumesRouter from "./routes/perfumes.route.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.JWT_KEY],
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  })
);
app.use(currentUser);

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/brands", brandsRouter);
app.use("/perfumes", perfumesRouter);
app.all("*", async () => {
  throw new NotFoundError("Route not found");
});
app.use(errorHandler);

export default app;
