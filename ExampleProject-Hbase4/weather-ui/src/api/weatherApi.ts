import axios from "axios";

const BASE_URL = "http://localhost:8081/api";

// Fetch all weather stations
export const getAllStations = () => 
  axios.get(`${BASE_URL}/stations`).then(res => res.data);

// Fetch a single station by ID
export const getStationById = (stationId: string) =>
  axios.get(`${BASE_URL}/stations/${stationId}`).then(res => res.data);

// Fetch observations with optional parameters
export const getObservations = (
  stationId: string,
  limit = 20,
  fromTimestamp?: number
) =>
  axios
    .get(`${BASE_URL}/stations/${stationId}/observations`, {
      params: { 
        limit,
        from: fromTimestamp
      },
    })
    .then(res => res.data);

// Add a new temperature observation
export const addObservation = (stationId: string, temperature: number) =>
  axios.post(
    `${BASE_URL}/stations/${stationId}/observations`,
    { temperature }
  ).then(res => res.data);

// Fetch weather statistics
export const getWeatherStats = (stationId: string, timeRange = "24h") =>
  axios
    .get(`${BASE_URL}/stations/${stationId}/stats`, {
      params: { timeRange },
    })
    .then(res => res.data);

// Search stations by location or name
export const searchStations = (query: string) =>
  axios
    .get(`${BASE_URL}/stations/search`, {
      params: { q: query },
    })
    .then(res => res.data);