import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import CountryDetails from "./CountryDetails";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("Filter By Region");
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        if (!res.ok) throw new Error("tinubu");
        const data = await res.json();
        setCountries(data);
      } catch (Error) {
        console.log(Error);
      }
    }
    fetchCountries();
  }, []);

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="search-filter-container">
                <Searchbar
                  searchText={searchText}
                  setSearchText={setSearchText}
                />
                <Filter
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                />
              </div>
              <Country
                countries={countries}
                selectedRegion={selectedRegion}
                searchText={searchText}
              />
            </>
          }
        ></Route>
        <Route
          path="/country/:cname"
          element={<CountryDetails countries={countries} />}
        />
      </Routes>
    </div>
  );
}

function Header() {
  return (
    <div className="px-1 flex space-btw with-shadow py-1 centered">
      {" "}
      <h2 className="font-17">Where in the world?</h2>
      <Mode />
    </div>
  );
}
function Mode() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <button
      className="flex gap-1 centered"
      onClick={() => setDarkMode(!darkMode)}
    >
      <Icon icon={darkMode ? "ph:moon-fill" : "ph:sun-fill"} width="20" />
      <p>{darkMode ? "Dark Mode" : "Light Mode"}</p>
    </button>
  );
}

function Searchbar({ searchText, setSearchText }) {
  return (
    <div className="mt-2 px-1 search-bar with-shadow mx-1">
      <input
        type="text"
        placeholder="Search for a country"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
}
function Filter({ selectedRegion, setSelectedRegion }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (region) => {
    setSelectedRegion(region);
    setIsOpen(false);
  };
  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
  return (
    <div className="dropdown px-1">
      <button
        className="toggle with-shadow px-1"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {selectedRegion}
      </button>
      <ul
        className={
          isOpen ? "dropdown-menu with-shadow" : "dropdown-menu hidden"
        }
      >
        {regions.map((region, i) => (
          <li
            key={i}
            onClick={() => {
              handleSelect(region);
            }}
          >
            {region}
          </li>
        ))}
      </ul>
    </div>
  );
}
function Country({ countries, selectedRegion, searchText }) {
  const navigate = useNavigate();
  const sortByRegion =
    selectedRegion === "Filter By Region"
      ? countries
      : countries.filter((country) => country.region === selectedRegion);

  const filteredCountries = sortByRegion.filter((country) =>
    country.name.common.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="cards-container flex-column gap-2 mx-1">
      {filteredCountries.length > 0 ? (
        filteredCountries.map(
          ({ name, population, region, capital, cca3, flags }) => (
            <div
              className="country-card mt-2"
              key={cca3}
              onClick={() => navigate(`/country/${name.common}`)}
            >
              <div className="country-img">
                <img src={flags?.png} alt={`${name.common} flag`} />
              </div>
              <div className="card-details with-shadow-three">
                <h2 className="mb-1 name ">{name.common}</h2>
                <p>Population: {population.toLocaleString()}</p>
                <p>Region: {region}</p>
                <p>Capital: {capital?.[0] || "N/A"}</p>
              </div>
            </div>
          )
        )
      ) : (
        <p>No countries found</p>
      )}
    </div>
  );
}
// french SOuthern

export default App;
