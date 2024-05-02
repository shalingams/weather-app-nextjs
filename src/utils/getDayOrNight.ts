export function getDayOrNight(iconName: string, dateTimeString: string): string {
  const dateTime = new Date(dateTimeString);
  const hours = dateTime.getHours();
  
  const isDayTime = hours > 6 && hours < 18;

  return isDayTime ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "d");
}
