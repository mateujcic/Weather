import React, { useEffect, useState } from "react";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import AirIcon from "@mui/icons-material/Air";
import CloudIcon from "@mui/icons-material/Cloud";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import styles from "../styles/Deatils.module.css";
import Head from "next/head";


export const getStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  console.log(id);

  const res = await fetch(
    "https://foreca-weather.p.rapidapi.com/current/" +
      id +
      "?alt=0&tempunit=C&windunit=MS&tz=Europe%2FBerlin&lang=en",
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "foreca-weather.p.rapidapi.com",
        "x-rapidapi-key": "6a62bde674msh23dd093a4ce20a2p1a713ajsnde6765380ec8",
      },
    }
  );

  const data = await res.json();

  const resCity = await fetch(
    "https://foreca-weather.p.rapidapi.com/location/" + id,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "foreca-weather.p.rapidapi.com",
        "x-rapidapi-key": "6a62bde674msh23dd093a4ce20a2p1a713ajsnde6765380ec8",
      },
    }
  );

  const dataCity = await resCity.json();
  return {
    props: {
      city: {
        temperature: data.current.temperature,
        windSpeed: data.current.windSpeed,
        cloudiness: data.current.cloudiness,
        uvIndex: data.current.uvIndex,
        name: dataCity.name,
        country: dataCity.country,
        symbolPhrase: data.current.symbolPhrase,
      },
    },
  };
};

function Details({ city }) {
  console.log(city);
  const [image, setImage] = useState();
  function changeBgImage(weather, wind) {
    if ((weather === "clear")) {
      setImage(styles.sunnyBg);
    } else if ((weather === "rain")) {
      setImage(styles.rainyBg);
    }
    else {
      setImage(styles.cloudyBg);
    } 
    if (wind > 5) {
      setImage(styles.windyBg);
    }
  }

  useEffect(() => {
    changeBgImage(city.symbolPhrase);
    if (city.windSpeed > 6) {
      changeBgImage(city.symbolPhrase, city.windSpeed);
    }
    
  },);

  return (
    
    <div>
       <Head>
        <title>Weather | {city.name}</title>
        <meta name="keywords" content="weather" />
      </Head>
      <h1 className={styles.text}>
        Weather for {""}
        <span className={styles.city}>
          {city.name}, {city.country}
        </span>
      </h1>
      <div className={styles.cardsContainer}>
        <div className={`${styles.card} ${image}`}>
          <p className={styles.temperature}>{city.temperature} °C</p>
          <p className={styles.symbolPhrase}>{city.symbolPhrase}</p>
          <div className={styles.miniCardContainer}>
            <div className={styles.miniCard}>
              <p className={styles.description}>Wind Speed </p>
              <p className={styles.miniValue}>{city.windSpeed} m/s</p>
            </div>
            <div className={styles.miniCard}>
              <p className={styles.description}>Cloudiness</p>
              <p className={styles.miniValue}>{city.cloudiness}%</p>
            </div>
            <div className={styles.miniCard} style={{ marginRight: 0 }}>
              <p className={styles.description}>UV Index </p>
              <p className={styles.miniValue}>{city.uvIndex}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
