import { defineStore } from 'pinia';
import useActiveUserStore from './activeUserStore';
import dietApi from '@/api/diet.api';
import { DietEntry } from '@/@types';
import Month from '@/classes/calender/Month';
import Week from '@/classes/calender/Week';

const useDietStore = defineStore('diet', {
  state: () => ({
    _activeUserDiets: [] as DietEntry[],
    _activeUserDietsThisWeek: [] as DietEntry[],
    _activeUserDietsThisMonth: [] as DietEntry[],
    _dietDayTimeOptions: ['breakfast', 'lunch', 'dinner', 'snacks'],
  }),

  getters: {
    activeUserDiets: (state) => state._activeUserDiets,
    activeUserDietsThisWeek: (state) => state._activeUserDietsThisWeek,
    activeUserDietsThisMonth: (state) => state._activeUserDietsThisWeek,
    activeUserDietsThisWeekPlanned: (state) => {
      return state._activeUserDietsThisWeek?.length;
    },
    dietDayTimeOptions: (state) => state._dietDayTimeOptions,
  },

  actions: {
    async syncActiveUserDiets(): Promise<void> {
      const activeUserStore = useActiveUserStore();
      const userId = activeUserStore.account.$id;
      const [diets, error] = await dietApi.fetchDietsByUserId(userId);
      this._activeUserDiets = diets as DietEntry[];
    },

    async syncActiveUserDietsThisWeek(): Promise<void> {
      const activeUserStore = useActiveUserStore();
      const week = new Week();
      const from = week.getFirstDay().localTimeMidnightUnix;
      const to = week.getLastDay().localTimeMidnightUnix;
      const userId = activeUserStore.account.$id;
      const [diets, error] = await dietApi.fetchDietsByUserIdAndDate(
        userId,
        from,
        to,
      );
      this._activeUserDietsThisWeek = diets as DietEntry[];
    },

    async syncActiveUserDietsThisMonth(): Promise<void> {
      const activeUserStore = useActiveUserStore();
      const month = new Month();
      const from = month.getMonthsWeek(0).getFirstDay().localTimeMidnightUnix;
      const to = month
        .getMonthsWeek(month.weeks.length - 1)
        .getLastDay().localTimeMidnightUnix;
      const userId = activeUserStore.account.$id;
      const [diets, error] = await dietApi.fetchDietsByUserIdAndDate(
        userId,
        from,
        to,
      );
      this._activeUserDietsThisMonth = diets as DietEntry[];
    },
  },
});

export default useDietStore;
