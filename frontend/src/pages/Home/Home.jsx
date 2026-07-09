import CarGrid from "@/components/Cars/CarGrid"
// import CarListing from "@/components/home/CarListing"
import SearchBar from "@/components/home/SearchBar"

function Home() {
    return (
        <>
            <div className="flex items-center justify-center">
                <SearchBar />
            </div>
            {/* <CarListing /> */}
            <div className="container mx-auto px-6 bg-white py-10">
                <div className="flex flex-col items-center justify-center  px-6">
                    <div className="text-center">
                        <h1 className="text-4xl text-center font-semibold ">Featured Vehicles</h1>
                        <p className="text-lg text-gray-600 ">Explore our selection of premium vehicles available for your next adventure.</p>

                        <div className="p-10">
                            <CarGrid />
                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}

export default Home