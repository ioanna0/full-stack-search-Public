import { useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCodeSandboxHost } from "@codesandbox/utils";

type Hotel = { _id: string, chain_name: string; hotel_name: string; city: string, country: string };
type City = { name: string };
type Country = { country: string; countryisocode: string };
type AutocompleteResult = { type: 'hotel' | 'city' | 'country'; name: string };

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost ? `https://${codeSandboxHost}` : 'http://localhost:3001';

const fetchResults = async (value: string): Promise<AutocompleteResult[]> => {
  const data = await fetch(`${API_URL}/autocomplete?q=${value}`);
  return data.json();
};

function App() {
  const [query, setQuery] = useState('');
  const [showClearBtn, setShowClearBtn] = useState(false);

  const { data: results = [], isFetching } = useQuery({
    queryKey: ['autocomplete', query],
    queryFn: () => fetchResults(query),
    enabled: query.length > 0,
    keepPreviousData: true,
  });

  const fetchData = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setShowClearBtn(value.length > 0);
  };

  const clearSearch = () => {
    setQuery('');
    setShowClearBtn(false);
  };

  const hotels = results.filter((result) => result.type === 'hotel');
  const cities = results.filter((result) => result.type === 'city');
  const countries = results.filter((result) => result.type === 'country');

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="dropdown">
              <div className="form">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  className="form-control form-input"
                  placeholder="Search accommodation..."
                  onChange={fetchData}
                  value={query}
                />
                {showClearBtn && (
                  <span className="left-pan" onClick={clearSearch}>
                    <i className="fa fa-close"></i>
                  </span>
                )}
              </div>
              {!!results.length && !isFetching && (
                <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
                  <h2>Hotels</h2>
                  {hotels.length ? hotels.map((hotel, index) => (
                    <li key={index}>
                      <a href={`/hotels/${hotel.name}`} className="dropdown-item">
                        <i className="fa fa-building mr-2"></i>
                        {hotel.name}
                      </a>
                      <hr className="divider" />
                    </li>
                  )) : <p>No hotels matched</p>}

                  <h2>Countries</h2>
                  {countries.length ? countries.map((country, index) => (
                    <li key={index}>
                      <a href={`/countries/${country.name}`} className="dropdown-item">
                        <i className="fa fa-building mr-2"></i>
                        {country.name}
                      </a>
                      <hr className="divider" />
                    </li>
                  )) : <p>No countries matched</p>}

                  <h2>Cities</h2>
                  {cities.length ? cities.map((city, index) => (
                    <li key={index}>
                      <a href={`/cities/${city.name}`} className="dropdown-item">
                        <i className="fa fa-building mr-2"></i>
                        {city.name}
                      </a>
                      <hr className="divider" />
                    </li>
                  )) : <p>No cities matched</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
