import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import incomesRoute from "./routes/incomes.routes.js";
import adminRoute from "./routes/admin.route.js";
import jwt from "jsonwebtoken";
import path from "path";
import axios from "axios";
const app = express();
dotenv.config();

const PORT = 5058;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
    origin: ["https://bnbkombat.live", "http://localhost:3000","http://localhost:3001","https://admin.bnbkombat.live"],
    credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/all-incomes", incomesRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listening at port ${PORT}`);
});
