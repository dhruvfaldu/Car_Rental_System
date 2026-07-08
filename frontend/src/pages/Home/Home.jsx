import CarListing from "@/components/home/CarListing"
import SearchBar from "@/components/home/SearchBar"

function Home() {
    return (
        <>
            <div className="flex items-center justify-center">
                <SearchBar />
            </div>
            <CarListing />
        </>
    )
}

export default Home