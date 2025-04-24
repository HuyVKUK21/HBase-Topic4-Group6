import { useEffect, useState } from "react";
import { getAllStations, searchStations } from "../api/weatherApi";
import StationCard from "../components/StationCard";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [stations, setStations] = useState<any[]>([]);
  const [filteredStations, setFilteredStations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getAllStations();
        setStations(data);
        setFilteredStations(data);
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError("Failed to load weather stations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStations();
  }, []);

  useEffect(() => {
    // Filter stations based on search query
    if (!searchQuery.trim()) {
      setFilteredStations(stations);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = stations.filter(
      station => 
        station.name.toLowerCase().includes(query) ||
        station.location.toLowerCase().includes(query) ||
        (station.description && station.description.toLowerCase().includes(query))
    );
    
    setFilteredStations(filtered);
  }, [searchQuery, stations]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredStations(stations);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const results = await searchStations(searchQuery);
      setFilteredStations(results);
    } catch (err) {
      console.error("Search error:", err);
      // Fall back to client-side filtering if the API fails
      const query = searchQuery.toLowerCase();
      const filtered = stations.filter(
        station => 
          station.name.toLowerCase().includes(query) ||
          station.location.toLowerCase().includes(query) ||
          (station.description && station.description.toLowerCase().includes(query))
      );
      setFilteredStations(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Weather Station Network</h1>
        <p className="text-gray-600">View real-time temperature data from our global network of weather stations</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stations by name or location..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>
      
      {isLoading && (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-600">Loading stations...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {!isLoading && filteredStations.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-600">No stations found matching "{searchQuery}"</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((station: any) => (
          <StationCard
            key={station.id}
            station={station}
            onClick={() => navigate(`/station/${station.id}`)}
          />
        ))}
      </div>
    </div>
  );
}