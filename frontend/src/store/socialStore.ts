import { AppServerResponseOrError, Ingredient } from '../@types/index';
import { INGREDIENTS_COLLECTION_ID } from '../constants';
import { AppwriteException, Models, Query } from 'appwrite';

import { defineStore } from 'pinia';
import { appwriteClient } from '../api/appwrite';

const useSocialStore = defineStore('social', {
  state: () => ({}),

  getters: {},

  actions: {},
});

export default useSocialStore;
