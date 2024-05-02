
export function convertKelvinToCelsius(kelvin: number) {
  const celsius = kelvin - 273.15;
  return Math.floor(celsius);
}
