import { AppDietEntity, DayWithDiet } from '@/@types';
import Day from './Day';

const oneHour = 24 * 60 * 60 * 1000;

interface WeekConstructor {
  timestamp?: number;
  diets?: AppDietEntity[];
}

export default class Week {
  days: Day[];
  daysWithDiet: DayWithDiet[] = [];

  constructor(options: WeekConstructor) {
    this.days = this.constructWeekDays(
      options?.timestamp || new Date().getTime(),
    );
    this.daysWithDiet = this.mapDietToWeekdays(options?.diets || []);
  }

  public mapDietToWeekdays(payload: AppDietEntity[]) {
    return this.days.map((day) => {
      const localDay = { ...day };
      localDay.diets = payload.filter(
        (diet) =>
          diet.date_unix >= day.localTimeMidnightUnix &&
          diet.date_unix < day.localTimeMidnightUnix + oneHour,
      );
      return localDay;
    });
  }

  private constructWeekDays(timestamp: number) {
    const days: Day[] = [];
    const date = new Date(timestamp);
    const day = date.getDay();
    const startDate = new Date(date.getTime() - day * oneHour);
    const endDate = new Date(date.getTime() + (6 - day) * oneHour);
    for (let i = startDate.getTime(); i <= endDate.getTime(); i += oneHour) {
      days.push(new Day(i));
    }
    return days;
  }
}
