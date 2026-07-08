import {
    Car,
    CalendarDays,
    IndianRupee,
    Users,
} from "lucide-react";

export const stats = [
    {
        id: 1,
        title: "Total Cars",
        value: "120",
        growth: "+8%",
        icon: Car,
        color: "text-blue-600",
        bg: "bg-blue-100",
    },
    {
        id: 2,
        title: "Bookings",
        value: "342",
        growth: "+15%",
        icon: CalendarDays,
        color: "text-green-600",
        bg: "bg-green-100",
    },
    {
        id: 3,
        title: "Revenue",
        value: "₹4,85,000",
        growth: "+12%",
        icon: IndianRupee,
        color: "text-orange-600",
        bg: "bg-orange-100",
    },
    {
        id: 4,
        title: "Customers",
        value: "185",
        growth: "+5%",
        icon: Users,
        color: "text-purple-600",
        bg: "bg-purple-100",
    },
];

export const fleetStatus = [
    {
        id: 1,
        label: "Available",
        value: 75,
        color: "bg-green-500",
    },
    {
        id: 2,
        label: "Booked",
        value: 22,
        color: "bg-blue-500",
    },
    {
        id: 3,
        label: "Rented",
        value: 18,
        color: "bg-orange-500",
    },
    {
        id: 4,
        label: "Maintenance",
        value: 5,
        color: "bg-red-500",
    },
];

export const bookingStatus = [
    {
        id: 1,
        label: "Pending",
        value: 8,
        color: "bg-yellow-500",
    },
    {
        id: 2,
        label: "Confirmed",
        value: 35,
        color: "bg-blue-500",
    },
    {
        id: 3,
        label: "Picked Up",
        value: 15,
        color: "bg-purple-500",
    },
    {
        id: 4,
        label: "Completed",
        value: 102,
        color: "bg-green-500",
    },
    {
        id: 5,
        label: "Cancelled",
        value: 4,
        color: "bg-red-500",
    },
];

export const recentBookings = [
    {
        id: "BK1001",
        customer: "Dhruv Faldu",
        car: "Toyota Fortuner",
        pickup: "12 Jul 2026",
        returnDate: "15 Jul 2026",
        status: "Confirmed",
    },
    {
        id: "BK1002",
        customer: "Rahul Patel",
        car: "Hyundai Creta",
        pickup: "13 Jul 2026",
        returnDate: "18 Jul 2026",
        status: "Pending",
    },
    {
        id: "BK1003",
        customer: "Amit Shah",
        car: "Mahindra XUV700",
        pickup: "14 Jul 2026",
        returnDate: "16 Jul 2026",
        status: "Completed",
    },
];