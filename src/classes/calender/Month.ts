import { DietEntry, DayWithDiet } from '@/@types';
import Week from './Week';

const oneWeek = 7 * 24 * 60 * 60 * 1000;

interface MonthConstructor {
  timestamp?: number;
  diets?: DietEntry[];
}

export default class Month {
  weeks: Week[];

  constructor(options?: MonthConstructor) {
    this.weeks = this.constructMonthWeeks(
      options?.timestamp || new Date().getTime(),
      options?.diets || [],
    );
  }

  public getMonthsWeek(index: number) {
    return this.weeks[index];
  }

  public constructMonthWeeks(timestamp: number, payload: DietEntry[]) {
    const weeks: Week[] = [];
    const date = new Date(timestamp);
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    for (let i = startDate.getTime(); i <= endDate.getTime(); i += oneWeek) {
      weeks.push(new Week({ timestamp: i, diets: payload }));
    }
    return weeks;
  }
}
