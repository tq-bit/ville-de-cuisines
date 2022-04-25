import { AppServerResponseOrError } from '../@types/commons';
import { INGREDIENTS_COLLECTION_ID } from '../constants';
import { AppwriteException, Models } from 'appwrite';

import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';

export interface Ingredient {
  $id?: string;
  name: string;
  description: string;
  quantity: number;
  quantity_unit: string;
  calories: number;
  nutrients: string;
}

const ingredientsStore = defineStore('ingredients', {
  state: () => ({
    _ingredients: [
      {
        $id: '',
        name: '',
        description: '',
        quantity: 0,
        quantity_unit: '',
        calories: 0,
        nutrients: '',
      },
    ] as Ingredient[],
    _quantityOptions: [
      { key: 'l', value: 'Liter' },
      { key: 'g', value: 'Gram' },
      { key: 'pc', value: 'Pieces' },
      { key: 'tsp', value: 'Teaspoon' },
      { key: 'tbsp', value: 'Tablespoon' },
    ],
  }),

  getters: {
    ingredients: (state) => state._ingredients,
    quantityOptions: (state) => state._quantityOptions,

    quantityOptionKeys: (state) => {
      return state._quantityOptions.map((option) => option.key);
    },
    ingredientById: (state) => ($id: string) => {
      return state._ingredients.find((ingredient) => ingredient.$id === $id);
    },
  },

  actions: {
    async fetchIngredients() {
      const response = await appwriteClient.database.listDocuments(
        INGREDIENTS_COLLECTION_ID,
      );

      console.log(response);

      this._ingredients = response.documents;
    },

    async createIngredient(payload: Ingredient): AppServerResponseOrError {
      try {
        const response = await appwriteClient.database.createDocument(
          INGREDIENTS_COLLECTION_ID,
          'unique()',
          payload,
        );
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
  },
});

export default ingredientsStore;