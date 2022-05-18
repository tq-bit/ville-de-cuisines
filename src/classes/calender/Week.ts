import { DietEntry, DayWithDiet } from '@/@types';
import Day from './Day';

import { ONE_DAY } from '@/constants/calender';

interface WeekConstructor {
  timestamp?: number;
  diets?: DietEntry[];
}

export default class Week {
  days: Day[];
  daysWithDiet: DayWithDiet[] = [];
  calenderWeek: number;

  constructor(options?: WeekConstructor) {
    this.days = this.constructWeekDays(
      options?.timestamp || new Date().getTime(),
    );
    this.daysWithDiet = this.mapDietToWeekdays(options?.diets || []);
    this.calenderWeek = this.constructCalenderWeek(
      options?.timestamp || new Date().getTime(),
    );
  }

  public getFirstDay() {
    return this.days[0];
  }

  public getLastDay() {
    return this.days[this.days.length - 1];
  }

  public mapDietToWeekdays(payload: DietEntry[]) {
    return this.days.map((day) => {
      const localDay = { ...day };
      localDay.diets = payload.filter(
        (diet) =>
          diet.date_unix >= day.localTimeMidnightUnix &&
          diet.date_unix < day.localTimeMidnightUnix + ONE_DAY,
      );
      return localDay;
    });
  }

  private constructWeekDays(timestamp: number) {
    const days: Day[] = [];
    const date = new Date(timestamp);
    const day = date.getDay();
    const startDate = new Date(date.getTime() - day * ONE_DAY);
    const endDate = new Date(date.getTime() + (6 - day) * ONE_DAY);
    for (let i = startDate.getTime(); i <= endDate.getTime(); i += ONE_DAY) {
      days.push(new Day(i));
    }
    return days;
  }

  private constructCalenderWeek(timestamp: number) {
    const date = new Date(timestamp);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / ONE_DAY;
    return Math.ceil(pastDaysOfYear / 7);
  }
}
