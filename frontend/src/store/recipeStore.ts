import { AppServerResponseOrError, Recipe } from '../@types/commons';
import { RECIPES_COLLECTION_ID } from '../constants';
import { AppwriteException } from 'appwrite';

import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';

const ingredientsStore = defineStore('ingredients', {
  state: () => ({
    _count: 0,
    _recipes: [] as Recipe[],
  }),

  getters: {
    recipes: (state) => state._recipes,
  },

  actions: {
    async fetchRecipes() {
      const response = await appwriteClient.database.listDocuments(
        RECIPES_COLLECTION_ID,
      );
      this._recipes = response.documents as Recipe[];
    },

    async createRecipe(payload: Recipe): AppServerResponseOrError {
      try {
        const response: Recipe = await appwriteClient.database.createDocument(
          RECIPES_COLLECTION_ID,
          'unique()',
          payload,
        );
        this.addRecipe(response);
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async updateRecipe({ $id, ...payload }: Recipe): AppServerResponseOrError {
      try {
        const response = await appwriteClient.database.updateDocument(
          RECIPES_COLLECTION_ID,
          $id || '',
          payload,
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async deleteRecipe({ $id }: Recipe): AppServerResponseOrError {
      try {
        const response = await appwriteClient.database.deleteDocument(
          RECIPES_COLLECTION_ID,
          $id || '',
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    addRecipe(recipe: Recipe) {
      this._recipes.push(recipe);
    },
  },
});

export default ingredientsStore;
