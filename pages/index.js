import Head from "next/head";
import Link from "next/link";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import styles from "../styles/Home.module.css";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

function Home({ currentCity }) {
  const [city, setCity] = React.useState("");
  const [cityID, setCityID] = React.useState("");
  const [cityName, setCityName] = React.useState("");
  const [locations, setLocations] = React.useState([]);

  const fetchLocations = async () => {
    const response = await fetch(
      "https://foreca-weather.p.rapidapi.com/location/search/" +
        city +
        "?lang=en",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "foreca-weather.p.rapidapi.com",
          "x-rapidapi-key":
            "6a62bde674msh23dd093a4ce20a2p1a713ajsnde6765380ec8",
        },
      }
    );
    const data = await response.json();
    try {
      const first5Locations = data.locations.slice(0, 5);
      setLocations(first5Locations);
    } catch (TypeError) {
      console.log("error");
    }
  };

  const handleChange = (e) => {
    let city = e.target.value;
    setCity(city);
    if (city.length > 1) {
      fetchLocations();
    }
  };

  let cityInfo = [];
  locations.map((city) => {
    cityInfo.push({ label: city.name + ", " + city.country, id: city.id });
  });
  return (
    <>
      <Head>
        <title>Weather | Home</title>
        <meta name="keywords" content="weather" />
      </Head>
      <div className={styles.container}>
        <h1>Search City</h1>
        <div className={styles.inputContainer}>
          <Autocomplete
            filterOptions={(x) => x}
            disablePortal
            onChange={(event, newValue) => {
              setCityID(newValue.id);
              setCityName(newValue.label);
            }}
            id="city-input"
            options={cityInfo}
            isOptionEqualToValue={(option, value) => {
              option.id === value.id;
            }}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                fullWidth
                onChange={handleChange}
                {...params}
                label="City"
              />
            )}
            renderOption={(option, value) => (
              <List>
                <Link key={value.id} href={"/" + value.id} passHref>
                  <ListItem className={styles.links}>
                    <ListItemText primary={value.label} />
                  </ListItem>
                </Link>
              </List>
            )}
          />
        </div>
      </div>
    </>
  );
}
export default Home;
