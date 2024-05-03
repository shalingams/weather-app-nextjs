"use client";
import Navbar from "./components/Navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "./components/Container";
import { convertKelvinToCelsius } from "@/utils/covertKelvinToCelsius";
import WeatherIcon from "./components/WeatherIcon";
import { getDayOrNight } from "@/utils/getDayOrNight";
import ForecastWeatherDetails from "./components/ForecastWeatherDetails";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { covertWindSpeed } from "@/utils/converWindSpeed";

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=Forssa&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );

  const todayData = data?.list[0];
  const sevenDaysData = data?.list.slice(0, 7);

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt4">
        {/* Today data */}
        <section className="space-y-4">
          <div className="space-y-4">
            <h2 className="flex gap-1 text-2xl items-end">
              <p className="text-xl">
                {format(parseISO(todayData?.dt_txt ?? ""), "EEEE")}
              </p>
              <p className="text-lg">
                ({format(parseISO(todayData?.dt_txt ?? ""), "dd.MM.yyyy")})
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              <div className="flx flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToCelsius(todayData?.main.temp ?? 0)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels Like</span>
                  <span>
                    {convertKelvinToCelsius(todayData?.main.feels_like ?? 0)}°
                  </span>
                  <p className="text-xs space-x-2">
                    <span>
                      {convertKelvinToCelsius(todayData?.main.temp_min ?? 0)}°↓
                    </span>{" "}
                    <span>
                      {" "}
                      {convertKelvinToCelsius(todayData?.main.temp_max ?? 0)}°↑
                    </span>
                  </p>
                </p>
              </div>
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt), "h:mm a")}
                    </p>
                    <p>
                      <WeatherIcon
                        iconName={getDayOrNight(d.weather[0].icon, d.dt_txt)}
                      />
                      {convertKelvinToCelsius(d?.main.temp ?? 0)}
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">
                {todayData?.weather[0].description}
              </p>
              <WeatherIcon
                iconName={getDayOrNight(
                  todayData?.weather[0].icon ?? "",
                  todayData?.dt_txt ?? ""
                )}
              />
            </Container>
            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
              <ForecastWeatherDetails
                visibility={metersToKilometers(todayData?.visibility ?? 10000)}
                humidity={`${todayData?.main.humidity}%`}
                windSpeed={covertWindSpeed(todayData?.wind.speed ?? 1.9)}
                airPressure={`${todayData?.main.pressure} hPa`}
                sunrise={format(
                  fromUnixTime(data?.city.sunrise ?? 1702949452),
                  "H:mm"
                )}
                sunset={format(
                  fromUnixTime(data?.city.sunrise ?? 1702949452),
                  "H:mm"
                )}
              />
            </Container>
          </div>
        </section>

        {/* 7 days forcast data */}
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">Forcast (7 days)</p>
        </section>
      </main>
    </div>
  );
}
