import { defineStore } from 'pinia';
import useActiveUserStore from './activeUserStore';
import dietApi from '@/api/diet.api';
import { AppDietEntity } from '@/@types';

const useDietStore = defineStore('diet', {
  state: () => ({
    _activeUserDiets: [] as AppDietEntity[],
    _dietDayTimeOptions: ['breakfast', 'lunch', 'dinner', 'snacks'],
  }),

  getters: {
    activeUserDiets: (state) => state._activeUserDiets,
    dietDayTimeOptions: (state) => state._dietDayTimeOptions,
  },

  actions: {
    async syncActiveUserDiets(): Promise<void> {
      const activeUserStore = useActiveUserStore();
      const userId = activeUserStore.account.$id;
      const [diets, error] = await dietApi.fetchDietsByUserId(userId);
      this._activeUserDiets = diets as AppDietEntity[];
    },
  },
});

export default useDietStore;
