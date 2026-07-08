import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "./bookingApi";

export default function useMyBookings() {
    return useQuery({
        queryKey: ["bookings"],
        queryFn: getMyBookings,
    })
}