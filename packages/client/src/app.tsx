import { Routes, Route } from 'react-router-dom';
import CityDetails from './pages/CityDetails';
import CountryDetails from './pages/CountryDetails';
import Home from './pages/Home';  
import HotelDetails from './pages/HotelDetails'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hotels/:name" element={<HotelDetails />} />
      <Route path="/cities/:name" element={<CityDetails />} />
      <Route path="/countries/:name" element={<CountryDetails />} />
    </Routes>
  );
}

export default App;
