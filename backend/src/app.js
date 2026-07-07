import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import carRoutes from "./modules/Cars/car.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import featureRoutes from "./routes/feature.routes.js";
import bookingRoutes from "./modules/booking/booking.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import pickupRoutes from "./modules/pickup/pickup.routes.js";
import returnRoutes from "./modules/return/return.routes.js";
import invoiceRoutes from "./modules/invoice/invoice.routes.js";

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

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cars", carRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/features", featureRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/pickups", pickupRoutes);
app.use("/api/v1/returns", returnRoutes);
app.use("/api/v1/invoices", invoiceRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Car Rental API Running 🚗",
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

app.use(errorHandler);

export default app;