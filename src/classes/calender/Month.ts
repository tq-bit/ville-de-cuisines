import { DietEntry, DayWithDiet } from '@/@types';
import { string } from 'yup';
import Week from './Week';

const oneWeek = 7 * 24 * 60 * 60 * 1000;

interface MonthConstructor {
  timestamp?: number;
  diets?: DietEntry[];
}

export default class Month {
  name: string;
  weeks: Week[];

  constructor(options?: MonthConstructor) {
    this.name = this.getMonthName(options?.timestamp || new Date().getTime());
    this.weeks = this.constructMonthWeeks(
      options?.timestamp || new Date().getTime(),
      options?.diets || [],
    );
  }

  private getMonthName(timestamp: number) {
    const date = new Date(timestamp);
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][date.getMonth()];
  }

  public getMonthsWeek(index: number) {
    return this.weeks[index];
  }

  private constructMonthWeeks(timestamp: number, payload: DietEntry[]) {
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
