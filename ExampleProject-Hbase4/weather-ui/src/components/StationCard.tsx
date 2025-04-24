import React from "react";

interface StationCardProps {
  station: {
    id: string;
    name: string;
    location: string;
    description?: string;
    lastTemperature?: number;
    lastUpdated?: number;
  };
  onClick: () => void;
}

export default function StationCard({ station, onClick }: StationCardProps) {
  const hasTemperature = station.lastTemperature !== undefined;
  
  return (
    <div
      onClick={onClick}
      className="p-5 border rounded-xl shadow hover:bg-blue-50 cursor-pointer transition-all hover:shadow-md"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{station.name}</h2>
          <p className="text-gray-700">{station.location}</p>
        </div>
        
        {hasTemperature && station.lastTemperature !== undefined && (
          <div className="text-right">
            <div className="text-2xl font-bold">
              {(station.lastTemperature / 10).toFixed(1)}°C
            </div>
            {station.lastUpdated && (
              <div className="text-xs text-gray-500">
                {new Date(station.lastUpdated).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>
      
      {station.description && (
        <p className="text-sm text-gray-500 mt-3 line-clamp-2">{station.description}</p>
      )}
      
      <div className="mt-4 text-blue-600 text-sm font-medium">
        View details &rarr;
      </div>
    </div>
  );
}