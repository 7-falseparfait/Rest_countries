import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

function CountryDetails({ countries }) {
  const { cname } = useParams();
  const [borderNames, setBorderNames] = useState([]);
  const navigate = useNavigate();
  const country = countries.find((c) => c.name.common === cname);
  console.log(country);

  const {
    name,
    population,
    region,
    capital,
    flags,
    subregion,
    tld,
    languages,
    currencies,
    borders,
  } = country;

  useEffect(() => {
    if (!borders || borders.length === 0) return;

    async function fetchBorderNames() {
      try {
        const res = await Promise.all(
          borders.map((code) =>
            fetch(`https://restcountries.com/v3.1/alpha/${code}`).then((res) =>
              res.json()
            )
          )
        );

        const names = res.map((data) => data[0]?.name.common || "Unknown");
        setBorderNames(names);
      } catch (error) {
        console.log("Error fetching border countries:", error);
      }
    }

    fetchBorderNames();
  }, [borders]);

  const nativeName = Object.values(name.nativeName)[0].common;
  const currency = Object.values(currencies)
    .map((currency) => `${currency.name}`)
    .join(", ");
  const languageList = Object.values(languages).join(",");

  return (
    <>
      <button
        className="flex centered gap-05 back-btn with-shadow mt-1"
        onClick={() => navigate(`/`)}
      >
        <Icon icon="ri:arrow-left-long-fill" />
        Back
      </button>
      <div className="details">
        <div className="mt-3 detail-country">
          <div className="country-details-img">
            <img src={flags?.png} alt={`${name.common} flag`} />
          </div>
          <div className="cust">
            <div className="cust-1">
              <div className="pt-1">
                <h2 className="mt-1 mb-1">{name.common}</h2>
                <p>
                  <span className="label">Native Name:</span> {nativeName}
                </p>
                <p>
                  <span className="label">Population:</span>{" "}
                  {population.toLocaleString()}
                </p>
                <p>
                  <span className="label">Region:</span> {region}
                </p>
                <p>
                  <span className="label">Sub Region:</span>{" "}
                  {subregion || "N/A"}
                </p>
                <p>
                  <span className="label">Capital:</span> {capital}
                </p>
              </div>
              <div className="mt-1 pt-1">
                <p>
                  <span className="label">Top Level Domain:</span>{" "}
                  {tld?.[0] || "N/A"}
                </p>
                <p>
                  <span className="label">Currencies:</span> {currency || "N/A"}
                </p>
                <p>
                  <span className="label">Languages:</span>{" "}
                  {languageList || "N/A"}
                </p>
              </div>
            </div>
            <div className="border-container">
              <p>
                <span className="label">Border Countries:</span>
              </p>
              <div className="flex gap-1 flex-wrap">
                {borderNames.length > 0
                  ? borderNames.map((name, index) => (
                      <span className="borders with-shadow" key={index}>
                        {name}
                      </span>
                    ))
                  : "No Border Countries"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CountryDetails;
