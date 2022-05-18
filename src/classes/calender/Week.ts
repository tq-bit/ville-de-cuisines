import { DietEntry, DayWithDiet } from '@/@types';
import Day from './Day';

const oneDay = 24 * 60 * 60 * 1000;

interface WeekConstructor {
  timestamp?: number;
  diets?: DietEntry[];
}

export default class Week {
  days: Day[];
  daysWithDiet: DayWithDiet[] = [];

  constructor(options?: WeekConstructor) {
    this.days = this.constructWeekDays(
      options?.timestamp || new Date().getTime(),
    );
    this.daysWithDiet = this.mapDietToWeekdays(options?.diets || []);
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
          diet.date_unix < day.localTimeMidnightUnix + oneDay,
      );
      return localDay;
    });
  }

  private constructWeekDays(timestamp: number) {
    const days: Day[] = [];
    const date = new Date(timestamp);
    const day = date.getDay();
    const startDate = new Date(date.getTime() - day * oneDay);
    const endDate = new Date(date.getTime() + (6 - day) * oneDay);
    for (let i = startDate.getTime(); i <= endDate.getTime(); i += oneDay) {
      days.push(new Day(i));
    }
    return days;
  }
}
