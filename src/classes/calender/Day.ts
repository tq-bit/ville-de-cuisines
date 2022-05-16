import { AppDietEntity } from '@/@types';

export default class Day {
  dayName?: string;
  localTimeMidnightUnix: number;
  timezoneOffsetSeconds?: number;
  isToday?: boolean;
  diets: AppDietEntity[] = [];
  localDateString: string;

  constructor(timestamp: number) {
    const date = new Date(timestamp);
    this.dayName = this.getDayName(date.getDay());
    this.localTimeMidnightUnix = this.setToMidnight(date).getTime();
    this.timezoneOffsetSeconds = date.getTimezoneOffset() * 60;
    this.isToday = this.getIsToday(date);
    this.localDateString = this.getLocalDateString(date);
  }

  public getMidnight() {
    return this.localTimeMidnightUnix;
  }

  private getDayName(day: number) {
    if (!!day || day === 0) {
      return [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ][day];
    }
  }

  private getLocalDateString(date: Date) {
    const year = date.getFullYear();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  private getIsToday(then: Date) {
    return (
      this.setToMidnight(then).getTime() ===
      this.setToMidnight(new Date()).getTime()
    );
  }

  private setToMidnight(date: Date) {
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
