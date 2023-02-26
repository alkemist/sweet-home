export abstract class TimeHelper {
  static calcHoursAfter(date: string | Date): number {
    const dateTime = (new Date()).getTime();
    const lastUpdatedTime = new Date(date).getTime();
    return Math.abs(Math.round((dateTime - lastUpdatedTime) / (1000 * 60 * 60)));
  }
}
