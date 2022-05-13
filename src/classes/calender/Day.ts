import { AppDietEntity } from '@/@types';

export default class Day {
  dayName?: string;
  localTimeMidnightUnix: number;
  timezoneOffsetSeconds?: number;
  isToday?: boolean;
  diets: AppDietEntity[] = [];

  constructor(timestamp: number) {
    const date = new Date(timestamp);
    this.dayName = this.getDayName(date.getDay());
    this.localTimeMidnightUnix = this.setToMidnight(date).getTime();
    this.timezoneOffsetSeconds = date.getTimezoneOffset() * 60;
    this.isToday = this.getIsToday(date);
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
