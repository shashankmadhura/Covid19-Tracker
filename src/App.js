import React, { useState, useEffect } from "react";
import "./App.css";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortByCases } from "./utilities";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from "./utilities";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import EmailIcon from "@material-ui/icons/Email";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const getCountriesdata = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortByCases(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesdata();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const onCountryChange = async (event) => {
    const country = event.target.value;
    const url =
      country === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${country}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(country);
        setCountryInfo(data);
        country === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        country === "worldwide" ? setMapZoom(3) : setMapZoom(4);
      });
  };

  return (
    <div>
      <div className="app">
        <div className="app__left">
          <div className="app__header">
            <h1>COVID-19 Tracker</h1>
            <FormControl className="app__dropdown">
              <Select
                variant="outlined"
                value={country}
                onChange={onCountryChange}
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country, idx) => (
                  <MenuItem value={country.value} key={idx}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="app__status">
            <InfoBox
              onClick={(e) => setCasesType("cases")}
              title="COVID Cases"
              red
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={prettyPrintStat(countryInfo.cases)}
              isActive={casesType === "cases"}
            />
            <InfoBox
              onClick={(e) => setCasesType("recovered")}
              title="Recovered"
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat(countryInfo.recovered)}
              isActive={casesType === "recovered"}
              isGreen
            />
            <InfoBox
              onClick={(e) => setCasesType("deaths")}
              title="Deaths"
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={prettyPrintStat(countryInfo.deaths)}
              isActive={casesType === "deaths"}
            />
          </div>

          <Map
            casesType={casesType}
            center={mapCenter}
            zoom={mapZoom}
            countries={mapCountries}
          />
        </div>
        <div className="app__right">
          <Card>
            <CardContent>
              <Table countries={tableData} />
              <h3 className="wordwide__cases">Worldwide Cases</h3>
              <LineGraph casesType={casesType} />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="app__footer">
        <div className="footer__text">
          <h4>Designed by Shashank</h4>
        </div>
        <div>
          <a href="https://github.com/shashankmadhura">
            <GitHubIcon />
          </a>
          <a href="https://www.linkedin.com/in/shashank-s-7888201ab/">
            <LinkedInIcon />
          </a>
          <a href="mailto:shashankmadhura@gmail.com">
            <EmailIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
