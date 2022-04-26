import { AppServerResponseOrError, Ingredient } from '../@types/commons';
import { INGREDIENTS_COLLECTION_ID } from '../constants';
import { AppwriteException } from 'appwrite';

import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';

const ingredientsStore = defineStore('ingredients', {
  state: () => ({
    _count: 0,
    _ingredients: [] as Ingredient[],
    _quantityOptions: [
      { key: 'l', value: 'Liter (l)' },
      { key: 'g', value: 'Gram (g)' },
      { key: 'pc', value: 'Pieces (pc)' },
      { key: 'tsp', value: 'Teaspoon (tsp)' },
      { key: 'tbsp', value: 'Tablespoon (tbsp)' },
    ],
  }),

  getters: {
    ingredients: (state) => state._ingredients,
    quantityOptions: (state) => state._quantityOptions,

    quantityOptionKeys: (state) => {
      return state._quantityOptions.map((option) => option.key);
    },
    getIngredientById: (state) => ($id: string) => {
      return state._ingredients.find((ingredient) => ingredient.$id === $id);
    },
  },

  actions: {
    async fetchIngredients() {
      const response = await appwriteClient.database.listDocuments(
        INGREDIENTS_COLLECTION_ID,
      );
      this._ingredients = response.documents as Ingredient[];
    },

    async createIngredient(payload: Ingredient): AppServerResponseOrError {
      try {
        const response: Ingredient =
          await appwriteClient.database.createDocument(
            INGREDIENTS_COLLECTION_ID,
            'unique()',
            payload,
          );
        this.addIngredient(response);
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async updateIngredient({
      $id,
      ...payload
    }: Ingredient): AppServerResponseOrError {
      try {
        const response = await appwriteClient.database.updateDocument(
          INGREDIENTS_COLLECTION_ID,
          $id || '',
          payload,
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async deleteIngredient({ $id }: Ingredient) {
      try {
        const response = await appwriteClient.database.deleteDocument(
          INGREDIENTS_COLLECTION_ID,
          $id || '',
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    // Local methods
    addIngredient(ingredient: Ingredient) {
      this._ingredients.push(ingredient);
    },
  },
});

export default ingredientsStore;
