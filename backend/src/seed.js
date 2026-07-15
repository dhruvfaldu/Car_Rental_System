import mongoose from "mongoose";
import "dotenv/config";
import User from "./models/user.model.js";
import Brand from "./models/brand.model.js";
import Category from "./models/category.model.js";
import Feature from "./models/feature.model.js";
import Car from "./modules/Cars/car.model.js";
import { Booking } from "./modules/booking/booking.model.js";
import Payment from "./modules/payment/payment.model.js";
import Pickup from "./modules/pickup/pickup.model.js";
import Return from "./modules/return/return.model.js";
import Invoice from "./modules/invoice/invoice.model.js";
import { calculateExtraCharges } from "./utils/extraCharges.util.js";
import connectDB from "./config/database.js";

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log("🧹 Clearing existing database...");
        await User.deleteMany({});
        await Brand.deleteMany({});
        await Category.deleteMany({});
        await Feature.deleteMany({});
        await Car.deleteMany({});
        await Booking.deleteMany({});
        await Payment.deleteMany({});
        await Pickup.deleteMany({});
        await Return.deleteMany({});
        await Invoice.deleteMany({});

        console.log("👥 Creating Users...");
        const admin = await User.create({
            name: "Admin User",
            email: "admin@carrental.com",
            password: "password123",
            phone: "+919999999999",
            role: "admin",
            isVerified: true,
        });

        const customer = await User.create({
            name: "John Customer",
            email: "customer@carrental.com",
            password: "password123",
            phone: "+918888888888",
            role: "customer",
            isVerified: true,
        });

        const staff = await User.create({
            name: "Staff Handler",
            email: "staff@carrental.com",
            password: "password123",
            phone: "+917777777777",
            role: "staff",
            isVerified: true,
        });

        const driver = await User.create({
            name: "Professional Driver",
            email: "driver@carrental.com",
            password: "password123",
            phone: "+916666666666",
            role: "driver",
            isVerified: true,
        });

        console.log("🏷️ Creating Brands & Categories...");
        const teslaBrand = await Brand.create({
            name: "Tesla",
            logo: { public_id: "tesla_logo", secure_url: "https://res.cloudinary.com/tesla.png" },
        });

        const hyundaiBrand = await Brand.create({
            name: "Hyundai",
            logo: { public_id: "hyundai_logo", secure_url: "https://res.cloudinary.com/hyundai.png" },
        });

        const suvCat = await Category.create({
            name: "SUV",
            description: "Sports Utility Vehicle",
        });

        const sedanCat = await Category.create({
            name: "Sedan",
            description: "Luxury Sedan",
        });

        console.log("🛠️ Creating Features...");
        const gps = await Feature.create({
            name: "GPS Navigation",
            icon: "map-pin",
            description: "Built-in live GPS",
        });

        const sunroof = await Feature.create({
            name: "Panoramic Sunroof",
            icon: "sun",
            description: "Wide dual pane sunroof",
        });

        const autopilot = await Feature.create({
            name: "Autopilot",
            icon: "cpu",
            description: "Semi-autonomous driving module",
        });

        console.log("🚗 Creating Cars...");
        const model3 = await Car.create({
            name: "Model 3 Long Range",
            brand: teslaBrand._id,
            category: sedanCat._id,
            features: [gps._id, autopilot._id],
            year: 2024,
            fuelType: "Electric",
            transmission: "Automatic",
            seats: 5,
            color: "Midnight Silver",
            mileage: 15,
            registrationNumber: "MH12TS1234",
            pricePerDay: 5000,
            securityDeposit: 10000,
            allowedKMPerDay: 200,
            pricePerKM: 20,
            lateFeePerHour: 200,
            fuelChargePercentage: 50,
            images: [{ public_id: "model3_1", secure_url: "https://res.cloudinary.com/model3.jpg" }],
            status: "available",
            isFeatured: true,
            isActive: true,
        });

        const creta = await Car.create({
            name: "Creta Turbo DCT",
            brand: hyundaiBrand._id,
            category: suvCat._id,
            features: [gps._id, sunroof._id],
            year: 2023,
            fuelType: "Petrol",
            transmission: "Automatic",
            seats: 5,
            color: "Phantom Black",
            mileage: 12,
            registrationNumber: "MH14HY9999",
            pricePerDay: 3000,
            securityDeposit: 5000,
            allowedKMPerDay: 250,
            pricePerKM: 15,
            lateFeePerHour: 150,
            fuelChargePercentage: 60,
            images: [{ public_id: "creta_1", secure_url: "https://res.cloudinary.com/creta.jpg" }],
            status: "available",
            isFeatured: true,
            isActive: true,
        });

        console.log("📅 Creating Booking, Pickup, Return, and Invoice Lifecycle...");
        
        // Let's create an completed booking sequence
        const pickupDate = new Date();
        pickupDate.setDate(pickupDate.getDate() - 3); // 3 days ago

        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() - 1); // 1 day ago

        const totalDays = 2;
        const subtotal = model3.pricePerDay * totalDays;
        const tax = (subtotal * 18) / 100;
        const totalAmount = subtotal + tax + model3.securityDeposit;

        const booking = await Booking.create({
            bookingNumber: "CR-20260701-998822",
            user: customer._id,
            car: model3._id,
            pickupDate,
            returnDate,
            pickupLocation: "Airport Terminal 1",
            dropLocation: "Airport Terminal 1",
            totalDays,
            pricePerDay: model3.pricePerDay,
            subtotal,
            tax,
            securityDeposit: model3.securityDeposit,
            totalAmount,
            paymentMethod: "Online",
            bookingStatus: "Completed",
            assignedStaff: staff._id,
            driver: driver._id,
            driverName: driver.name,
            driverPhone: driver.phone,
            pickedUpAt: pickupDate,
            completedAt: returnDate,
            paidAt: pickupDate,
        });

        const payment = await Payment.create({
            booking: booking._id,
            user: customer._id,
            orderId: "order_mock123456",
            receipt: "receipt_mock123456",
            transactionId: "pay_mock123456",
            paymentGateway: "Razorpay",
            paymentMethod: "Online",
            amount: totalAmount,
            status: "Paid",
            paidAt: pickupDate,
        });

        booking.payment = payment._id;
        await booking.save();

        const pickup = await Pickup.create({
            booking: booking._id,
            car: model3._id,
            customer: customer._id,
            pickupDate,
            pickupLocation: booking.pickupLocation,
            odometerStart: 12000,
            fuelLevel: 100,
            notes: "Clean car handed over",
            staff: staff._id,
            signature: { public_id: "sig_1", secure_url: "https://res.cloudinary.com/sig.png" },
        });

        // Customer returns car 5 hours late and 50 KM over limit, with fuel at 80%
        const actualReturnDate = new Date(returnDate);
        actualReturnDate.setHours(actualReturnDate.getHours() + 5);

        const returnRecord = await Return.create({
            booking: booking._id,
            car: model3._id,
            customer: customer._id,
            returnDate: actualReturnDate,
            returnLocation: booking.dropLocation,
            odometerEnd: 12450, // 450km driven, 400km allowed
            fuelLevel: 80, // 20% drop
            damageNotes: "Scratched bumper",
            staff: staff._id,
            lateHours: 5,
            extraKM: 50,
        });

        const extraCharges = calculateExtraCharges({
            booking,
            car: model3,
            actualReturnDate,
            odometerEnd: 12450,
            odometerStart: 12000,
            fuelEnd: 80,
            fuelStart: 100,
            cleaningCharges: 500,
            damageCharges: 1500,
        });

        const invoiceTotal = booking.totalAmount + extraCharges.totalExtraAmount;
        const remainingAmount = invoiceTotal - payment.amount;

        const invoice = await Invoice.create({
            invoiceNumber: "INV-20260703-887711",
            customer: customer._id,
            booking: booking._id,
            payment: payment._id,
            pickup: pickup._id,
            return: returnRecord._id,
            subtotal: booking.subtotal,
            extraCharges: {
                lateFee: extraCharges.lateFee,
                extraKMFee: extraCharges.extraKMFee,
                fuelCharges: extraCharges.fuelCharges,
                cleaningCharges: 500,
                damageCharges: 1500,
            },
            tax: booking.tax + extraCharges.tax,
            discount: booking.discount,
            totalPaid: payment.amount,
            totalAmount: invoiceTotal,
            remainingAmount,
            status: "Pending", // Needs payment for extra charges
        });

        booking.pickupDetails = pickup._id;
        booking.returnDetails = returnRecord._id;
        booking.invoice = invoice._id;
        await booking.save();

        console.log("✅ Seed script finished successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
};

seedDatabase();
