export function metersToKilometers(valueInMeters: number): string {
  const valueInKilometers = valueInMeters / 1000;
  return`${valueInKilometers.toFixed(0)}km`;
}
