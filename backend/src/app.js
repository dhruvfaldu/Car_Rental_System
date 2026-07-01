import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

app.use(
    cors({
        origin: [
            process.env.CLIENT_URL,
            process.env.ADMIN_URL,
        ],
        credentials: true,
    })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Car Rental API is running 🚗",
    });
});

export default app;