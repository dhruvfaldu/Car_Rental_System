import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generatePDF = () => {
    const doc = new PDFDocument({ margin: 50 });
    const outputDir = path.resolve("..", "api-documentation.pdf");
    const stream = fs.createWriteStream(outputDir);

    doc.pipe(stream);

    // Document Title Page
    doc.fillColor("#1A202C").fontSize(26).text("CAR RENTAL SYSTEM", { align: "center" });
    doc.fontSize(18).text("SYSTEM AUDIT & API DOCUMENTATION", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).fillColor("#718096").text("Prepared by Senior Backend Engineering Team", { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });
    doc.moveDown(4);

    // Section 1: Folder Structure
    doc.addPage();
    doc.fontSize(16).fillColor("#2B6CB0").text("1. FOLDER STRUCTURE", { underline: true });
    doc.moveDown();
    doc.fontSize(10).fillColor("#2D3748").font("Courier");
    
    const structure = `
car-rental-system/
├── backend/
│   ├── package.json
│   ├── .env
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── seed.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── cloudinary.js
│   │   │   └── razorpay.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── brand.model.js
│   │   │   ├── category.model.js
│   │   │   └── feature.model.js
│   │   ├── modules/
│   │   │   ├── Cars/
│   │   │   │   ├── car.model.js
│   │   │   │   ├── car.constant.js
│   │   │   │   ├── car.controller.js
│   │   │   │   ├── car.routes.js
│   │   │   │   └── car.validator.js
│   │   │   ├── booking/
│   │   │   ├── payment/
│   │   │   ├── pickup/
│   │   │   ├── return/
│   │   │   └── invoice/
│   │   ├── middleware/
│   │   └── utils/
    `;
    doc.text(structure);
    doc.moveDown();

    // Section 2: Database Collections & Relations
    doc.addPage();
    doc.font("Helvetica").fontSize(16).fillColor("#2B6CB0").text("2. MONGODB DATABASE COLLECTIONS & RELATIONSHIPS", { underline: true });
    doc.moveDown();
    doc.fontSize(11).fillColor("#2D3748");
    
    doc.text("• Users Collection (Customer, Admin, Staff, Driver Roles)", { bold: true });
    doc.text("• Brands Collection (One-to-Many relationship with Cars)");
    doc.text("• Categories Collection (One-to-Many relationship with Cars)");
    doc.text("• Features Collection (Many-to-Many relationship with Cars)");
    doc.text("• Cars Collection (Status values: available, booked, rented, returned, maintenance)");
    doc.text("• Bookings Collection (Links User, Car, Payment, Pickup, Return, and Invoice)");
    doc.text("• Payments Collection (One-to-One relationship with Booking)");
    doc.text("• Pickups Collection (One-to-One relationship with Booking)");
    doc.text("• Returns Collection (One-to-One relationship with Booking)");
    doc.text("• Invoices Collection (Contains calculated extra charges, tax, subtotal, and status)");
    doc.moveDown(2);

    // Section 3: Rental Lifecycle Flow
    doc.fontSize(16).fillColor("#2B6CB0").text("3. RENTAL LIFECYCLE WORKFLOWS", { underline: true });
    doc.moveDown();
    doc.fontSize(10).fillColor("#4A5568");
    
    doc.text("1. Booking Creation: Customer books a car. Status = 'Pending'. Car remains 'available'.");
    doc.text("2. Payment Pre-authorization: Online Razorpay order creation. Payment = 'Paid'. Booking Status = 'Confirmed'. Car = 'booked'.");
    doc.text("3. Vehicle Handover (Pickup): Admin/Staff records pickup (starting odometer, fuel level, condition photos). Booking = 'Picked Up'. Car = 'rented'.");
    doc.text("4. Vehicle Return: Admin/Staff records return (ending odometer, fuel level, damages). Returns calculation logic triggered. Booking = 'Completed'.");
    doc.text("5. Invoice Generation: System automatically outputs an Invoice detailing extra fees (late fee, extra KM, missing fuel, damage charges).");
    doc.text("6. Vehicle Reset: Car is reset to 'available' or set to 'maintenance' if damage charges exceed threshold.");
    doc.moveDown(2);

    // Section 4: Complete API Endpoints
    doc.addPage();
    doc.fontSize(16).fillColor("#2B6CB0").text("4. COMPLETE API ENDPOINTS LIST", { underline: true });
    doc.moveDown();
    doc.fontSize(9).font("Courier").fillColor("#1A202C");

    const endpoints = [
        "POST  /api/v1/auth/register          - User self registration",
        "POST  /api/v1/auth/login             - Authenticate user, receive JWT cookie",
        "POST  /api/v1/auth/logout            - Clear auth token cookie",
        "GET   /api/v1/auth/me                - Fetch profile (JWT required)",
        "POST  /api/v1/brands                 - Create car brand (Admin)",
        "GET   /api/v1/brands                 - List brands",
        "POST  /api/v1/categories             - Create car category (Admin)",
        "POST  /api/v1/features               - Create optional accessory/feature (Admin)",
        "POST  /api/v1/cars                   - Add car with images multipart (Admin)",
        "GET   /api/v1/cars                   - List cars with filters, pagination, search",
        "POST  /api/v1/bookings               - Book a car (Customer)",
        "GET   /api/v1/bookings/my-bookings   - View my bookings (Customer)",
        "PATCH /api/v1/bookings/:id/status    - Confirm / reject booking (Admin)",
        "POST  /api/v1/payments               - Init payment record",
        "POST  /api/v1/payments/verify        - Validate Razorpay signature and confirm paid status",
        "POST  /api/v1/pickups                - Record car hand-off (Admin/Staff only)",
        "POST  /api/v1/returns                - Record returns, trigger invoice (Admin/Staff only)",
        "GET   /api/v1/invoices/my-invoices   - View my bills (Customer)",
        "GET   /api/v1/invoices/:id           - Details bill including extra charges",
        "PATCH /api/v1/invoices/:id/pay       - Pay unpaid invoice balances",
        "GET   /api/v1/invoices/:id/pdf       - Dynamic downloadable bill PDF"
    ];

    endpoints.forEach(e => {
        doc.text(e);
        doc.moveDown(0.5);
    });

    doc.addPage();
    doc.font("Helvetica").fontSize(14).fillColor("#2D3748").text("5. TESTING CHECKLIST & SEED INFO");
    doc.moveDown();
    doc.fontSize(10).fillColor("#4A5568");
    doc.text("Seeding accounts (Password for all: password123):");
    doc.text("• Admin: admin@carrental.com");
    doc.text("• Customer: customer@carrental.com");
    doc.text("• Staff: staff@carrental.com");
    doc.text("• Driver: driver@carrental.com");
    doc.moveDown();
    doc.text("Testing steps:");
    doc.text("1. Run 'npm run seed' to initialize mock data and booking lifecycle.");
    doc.text("2. Authenticate using login endpoints.");
    doc.text("3. Perform custom booking cycles and process pickups/returns to test dynamic pricing calculations.");

    doc.end();
    console.log(`✅ Dynamic PDF Generated at: ${outputDir}`);
};

generatePDF();
