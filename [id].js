import React, { useEffect, useState } from "react";
import styles from "../styles/Deatils.module.css";
import Head from "next/head";

export const getStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

let time;

export const getStaticProps = async (context) => {
  const id = context.params.id;

  const res = await fetch(
    "https://foreca-weather.p.rapidapi.com/current/" +
      id +
      "?alt=0&tempunit=C&windunit=MS&lang=en",
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
        time: data.current.time,
      },
    },
  };
};

function Details({ city }) {
  const [image, setImage] = useState();
  const [style, setStyle] = useState(true);
  function changeBgImage(weather, wind) {
    console.log(time.substr(0, time.indexOf(":")));
    console.log(time.substr(0, time.indexOf(":")) >= 18);
    if (weather === "clear") {
      if (
        time.substr(0, time.indexOf(":")) <= 6 ||
        time.substr(0, time.indexOf(":")) >= 18
      ) {
        setImage(styles.sunnyNightBg);
        setStyle(false);
      } else {
        setImage(styles.sunnyBg);
        setStyle(true);
      }
    } else if (weather === "rain" || weather === "light rain") {
      setImage(styles.rainyBg);
    } else {
      if (
        time.substr(0, time.indexOf(":")) <= 6 ||
        time.substr(0, time.indexOf(":")) >= 18
      ) {
        setImage(styles.cloudyNightBg);
        setStyle(false);
      } else {
        setImage(styles.cloudyBg);
        setStyle(true);
      }
    }
    if (wind > 5) {
      setImage(styles.windyBg);
    }
  }

  useEffect(() => {
    let timeData = city.time;
    console.log(timeData);
    time = city.time.substr(timeData.indexOf("T") + 1);
    changeBgImage(city.symbolPhrase);
    if (city.windSpeed > 6) {
      changeBgImage(city.symbolPhrase, city.windSpeed);
    }
  });

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
          <p className={style ? styles.temperature : styles.temperatureNight}>
            {city.temperature} °C
          </p>
          <p className={style ? styles.symbolPhrase : styles.symbolPhraseNight}>
            {city.symbolPhrase}
          </p>
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
