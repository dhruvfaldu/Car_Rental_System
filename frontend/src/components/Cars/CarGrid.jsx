import { useSearchParams } from "react-router-dom";
import { useCarsQuery } from "@/features/cars/useCarsQuery";
import CarCard from "./CarCard";
import CarPagination from "./CarPagination";
import EmptyState from "./EmptyState";

export default function CarGrid({ filters }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isLoading, isError } = useCarsQuery(filters);

    const handlePageChange = (newPage) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("page", newPage);
        setSearchParams(nextParams);
    };

    const handleResetFilters = () => {
        setSearchParams({});
    };

    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                        <div className="aspect-[16/10] bg-slate-100 rounded-xl" />
                        <div className="space-y-3">
                            <div className="h-4 bg-slate-100 rounded w-1/4" />
                            <div className="h-6 bg-slate-100 rounded w-3/4" />
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <div className="h-4 bg-slate-100 rounded" />
                                <div className="h-4 bg-slate-100 rounded" />
                            </div>
                            <div className="h-10 bg-slate-100 rounded-xl w-full pt-2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return <EmptyState message="Failed to load cars. Please try again." onReset={handleResetFilters} />;
    }

    if (!data?.data?.length) {
        return <EmptyState message="No cars found matching your selected filters." onReset={handleResetFilters} />;
    }

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {data.data.map((car) => (
                    <CarCard key={car._id} car={car} />
                ))}
            </div>

            <CarPagination
                page={data.pagination?.page || 1}
                totalPages={data.pagination?.totalPages || 1}
                onPageChange={handlePageChange}
            />
        </div>
    );
}