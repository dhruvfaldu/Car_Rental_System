import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function CarsHeader() {
    return (
        <section>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">

                <Link to="/" className="hover:text-primary">
                    Home
                </Link>

                <ChevronRight size={16} />

                <span>Cars</span>

            </div>

            <h1 className="mt-4 text-4xl font-bold">
                All Rental Cars
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
                Browse our premium fleet of luxury, economy, SUV and electric
                vehicles. Filter by brand, price, seats and fuel type to find
                your perfect ride.
            </p>

        </section>
    );
}