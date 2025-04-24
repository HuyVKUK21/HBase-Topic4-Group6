import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StationDetailPage from "./pages/StationDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/station/:stationId" element={<StationDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
