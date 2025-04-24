import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getObservations, getStationById, addObservation } from "../api/weatherApi";
import TemperatureChart from "../components/TemperatureChart";
import ObservationForm from "../components/ObservationForm";
import WeatherSummary from "../components/WeatherSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card } from "../components/ui/card"; // Added import for Card component

export default function StationDetailPage() {
  const { stationId } = useParams();
  const [station, setStation] = useState<any>(null);
  const [observations, setObservations] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("24h");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!stationId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const stationData = await getStationById(stationId);
      setStation(stationData);
      
      // Calculate timestamp for the selected time range
      let startTime = new Date();
      switch (timeRange) {
        case "24h":
          startTime.setHours(startTime.getHours() - 24);
          break;
        case "7d":
          startTime.setDate(startTime.getDate() - 7);
          break;
        case "30d":
          startTime.setDate(startTime.getDate() - 30);
          break;
        default:
          startTime.setHours(startTime.getHours() - 24);
      }
      
      const timestamp = startTime.getTime();
      const limit = timeRange === "24h" ? 24 : timeRange === "7d" ? 168 : 720;
      
      const obsData = await getObservations(stationId, limit, timestamp);
      const withCelsius = obsData.map((d: any) => ({
        ...d,
        temperatureCelsius: d.temperature / 10,
        timestamp: Number(d.timestamp) // Ensure timestamp is a number
      }));
      
      setObservations(withCelsius);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load station data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [stationId, timeRange]);

  const handleAddObservation = async (temperature: number) => {
    if (!stationId) return;
    
    try {
      await addObservation(stationId, temperature * 10); // Convert to internal format (× 10)
      // Refresh the data after adding
      fetchData();
    } catch (err) {
      console.error("Error adding observation:", err);
      setError("Failed to add observation. Please try again.");
    }
  };

  if (isLoading && !station) return <div className="p-6 text-center">Loading station data...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!station) return <div className="p-6 text-center">Station not found</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">{station.name}</h1>
        <p className="text-lg text-gray-700">{station.location}</p>
        <p className="text-gray-500 mt-2">{station.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Temperature History</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeRange("24h")}
                className={`px-3 py-1 rounded ${timeRange === "24h" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                24h
              </button>
              <button 
                onClick={() => setTimeRange("7d")}
                className={`px-3 py-1 rounded ${timeRange === "7d" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                7d
              </button>
              <button 
                onClick={() => setTimeRange("30d")}
                className={`px-3 py-1 rounded ${timeRange === "30d" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                30d
              </button>
            </div>
          </div>
          
          {observations.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No temperature data available for this time range
            </div>
          ) : (
            <TemperatureChart data={observations} timeRange={timeRange} />
          )}
        </Card>
        
        <div className="space-y-6">
          <Card className="p-4">
            <WeatherSummary observations={observations} />
          </Card>
          
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Add Observation</h2>
            <ObservationForm onSubmit={handleAddObservation} />
          </Card>
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Data Table</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="p-4 bg-white rounded-md shadow">
          <h3 className="text-lg font-medium mb-3">Recent Observations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature (°C)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {observations.slice(0, 10).map((obs: any, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(obs.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {obs.temperatureCelsius.toFixed(1)}°C
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="p-4 bg-white rounded-md shadow">
          <h3 className="text-lg font-medium mb-3">Temperature Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {observations.length > 0 ? (
              <>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-500">Average Temperature</p>
                  <p className="text-2xl font-bold">
                    {(observations.reduce((sum: number, obs: any) => sum + obs.temperatureCelsius, 0) / observations.length).toFixed(1)}°C
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-500">Maximum Temperature</p>
                  <p className="text-2xl font-bold">
                    {Math.max(...observations.map((obs: any) => obs.temperatureCelsius)).toFixed(1)}°C
                  </p>
                </div>
                <div className="p-4 bg-blue-100 rounded-lg">
                  <p className="text-sm text-gray-500">Minimum Temperature</p>
                  <p className="text-2xl font-bold">
                    {Math.min(...observations.map((obs: any) => obs.temperatureCelsius)).toFixed(1)}°C
                  </p>
                </div>
              </>
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                No data available for analysis
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}