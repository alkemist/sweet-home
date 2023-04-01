export abstract class DateHelper {
  static seconds(date: Date = new Date()) {
    return Math.round(date.getTime() / 1000);
  }
}
