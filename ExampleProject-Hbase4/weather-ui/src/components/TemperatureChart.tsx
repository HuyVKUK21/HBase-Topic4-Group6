import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from "recharts";

interface TemperatureChartProps {
  data: any[];
  timeRange: string;
}

export default function TemperatureChart({ data, timeRange }: TemperatureChartProps) {
  // Calculate average temperature
  const avgTemp = data.length > 0 
    ? data.reduce((sum, item) => sum + item.temperatureCelsius, 0) / data.length
    : 0;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    
    if (timeRange === "24h") {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === "7d") {
      return date.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const formatTooltipDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Define gradient colors
  const gradientOffset = () => {
    if (data.length === 0) return 0;
    
    const dataMax = Math.max(...data.map(item => item.temperatureCelsius));
    const dataMin = Math.min(...data.map(item => item.temperatureCelsius));
    
    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }
    
    return dataMax / (dataMax - dataMin);
  };
  
  const off = gradientOffset();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart 
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          dataKey="timestamp" 
          tickFormatter={formatDate} 
          domain={['dataMin', 'dataMax']}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis 
          domain={['auto', 'auto']}
          unit="°C"
          padding={{ top: 20, bottom: 20 }}
        />
        <Tooltip 
          labelFormatter={formatTooltipDate}
          formatter={(value: any) => [`${value.toFixed(1)}°C`, "Temperature"]}
        />
        <Legend />
        
        <defs>
          <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset={off} stopColor="#ff7300" stopOpacity={0.8}/>
            <stop offset={off} stopColor="#377bff" stopOpacity={0.8}/>
          </linearGradient>
        </defs>
        
        <Line 
          type="monotone" 
          dataKey="temperatureCelsius" 
          name="Temperature"
          stroke="url(#temperatureGradient)" 
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 7 }}
        />
        
        <ReferenceLine 
          y={avgTemp} 
          stroke="#888" 
          strokeDasharray="3 3"
          label={{ 
            value: `Avg: ${avgTemp.toFixed(1)}°C`, 
            fill: '#666',
            position: 'insideBottomRight'
          }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}