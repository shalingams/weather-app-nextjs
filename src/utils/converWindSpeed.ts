export function convertWindSpeed(valueInMeterPerSecond: number): string {
  const valueInKilometerPerHour = valueInMeterPerSecond * 3.6;
  return `${valueInKilometerPerHour.toFixed(0)}km/h`;
}
