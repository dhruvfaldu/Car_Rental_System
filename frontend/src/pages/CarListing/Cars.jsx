import { useSearchParams } from "react-router-dom";

import CarsHeader from "@/components/Cars/CarsHeader";
import CarFilters from "@/components/Cars/CarFilters";
import CarGrid from "@/components/Cars/CarGrid";
import FilterDrawer from "@/components/Cars/FilterDrawer";

export default function Cars() {

    const [searchParams] = useSearchParams();

    const filters = {

        page: Number(searchParams.get("page")) || 1,

        limit: 9,

        search: searchParams.get("search") || "",

        brand: searchParams.get("brand") || "",

        category: searchParams.get("category") || "",

        fuelType: searchParams.get("fuelType") || searchParams.get("fuel") || "",

        transmission: searchParams.get("transmission") || "",

        seats: searchParams.get("seats") || "",

        minPrice: searchParams.get("minPrice") || "",

        maxPrice: searchParams.get("maxPrice") || "",

        sort: searchParams.get("sort") || "newest",
    };

    return (

        <main className="min-h-screen bg-slate-50 py-10">

            <div className="container mx-auto px-4">

                <CarsHeader />

                <div className="mt-8 lg:hidden">

                    <FilterDrawer />

                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">

                    <aside className="hidden lg:block">

                        <CarFilters />

                    </aside>

                    <section>

                        <CarGrid filters={filters} />

                    </section>

                </div>

            </div>

        </main>
    );
}