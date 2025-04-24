import { useMemo } from "react";

interface WeatherSummaryProps {
  observations: any[];
}

export default function WeatherSummary({ observations }: WeatherSummaryProps) {
  const stats = useMemo(() => {
    if (!observations || observations.length === 0) {
      return {
        currentTemp: null,
        avgTemp: null,
        minTemp: null,
        maxTemp: null,
        trend: "stable"
      };
    }

    // Sort observations by timestamp (newest first)
    const sortedObs = [...observations].sort((a, b) => b.timestamp - a.timestamp);
    
    // Current temperature (most recent)
    const currentTemp = sortedObs[0].temperatureCelsius;
    
    // Calculate average
    const avgTemp = sortedObs.reduce(
      (sum, obs) => sum + obs.temperatureCelsius, 
      0
    ) / sortedObs.length;
    
    // Min and max temperatures
    const minTemp = Math.min(...sortedObs.map(obs => obs.temperatureCelsius));
    const maxTemp = Math.max(...sortedObs.map(obs => obs.temperatureCelsius));
    
    // Determine trend based on the last few observations
    let trend = "stable";
    if (sortedObs.length >= 3) {
      const recent = sortedObs.slice(0, 3);
      if (recent[0].temperatureCelsius > recent[2].temperatureCelsius) {
        trend = "rising";
      } else if (recent[0].temperatureCelsius < recent[2].temperatureCelsius) {
        trend = "falling";
      }
    }
    
    return { currentTemp, avgTemp, minTemp, maxTemp, trend };
  }, [observations]);

  if (!observations || observations.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  const getTrendIcon = () => {
    switch (stats.trend) {
      case "rising":
        return <span className="text-red-500">↗</span>;
      case "falling":
        return <span className="text-blue-500">↘</span>;
      default: 
        return <span className="text-gray-500">→</span>;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Current Weather</h2>
      
      <div className="flex items-center">
        <div className="text-4xl font-bold">
          {stats.currentTemp !== null ? `${stats.currentTemp.toFixed(1)}°C` : "N/A"}
        </div>
        <div className="ml-3 text-2xl">{getTrendIcon()}</div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 pt-2">
        <div>
          <div className="text-xs text-gray-500">Min</div>
          <div className="text-blue-600 font-medium">
            {stats.minTemp !== null ? `${stats.minTemp.toFixed(1)}°C` : "N/A"}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Avg</div>
          <div className="text-gray-700 font-medium">
            {stats.avgTemp !== null ? `${stats.avgTemp.toFixed(1)}°C` : "N/A"}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Max</div>
          <div className="text-red-600 font-medium">
            {stats.maxTemp !== null ? `${stats.maxTemp.toFixed(1)}°C` : "N/A"}
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 pt-2">
        {stats.trend === "rising" && "Temperature is rising"}
        {stats.trend === "falling" && "Temperature is falling"}
        {stats.trend === "stable" && "Temperature is stable"}
      </div>
    </div>
  );
}