import {
  AppServerResponseOrError,
  Ingredient,
  AppGalleryItemType,
} from '../@types/index';
import { INGREDIENTS_COLLECTION_ID, INGREDIENTS_BUCKET_ID } from '../constants';
import { AppwriteException, Models, Query } from 'appwrite';
import { v4 as uuid } from 'uuid';

import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';

const useIngredientsStore = defineStore('ingredients', {
  state: () => ({
    _count: 0,
    _ingredients: [] as Ingredient[],
    _ingredientSearchResults: [] as Ingredient[],
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
    ingredientSearchResults: (state) => state._ingredientSearchResults,

    ingredientSearchResultsForGallery: (state) => {
      return state._ingredientSearchResults.map((ingredient) => {
        return {
          $id: ingredient.$id,
          src: ingredient.primary_image_href,
          alt: ingredient.name,
          title: ingredient.name,
        } as AppGalleryItemType;
      });
    },
    quantityOptions: (state) => state._quantityOptions,

    quantityOptionKeys: (state) => {
      return state._quantityOptions.map((option) => option.key);
    },
    getIngredientById: (state) => ($id: string) => {
      return state._ingredients.find((ingredient) => ingredient.$id === $id);
    },
  },

  actions: {
    async syncIngredients(): Promise<void> {
      const response = await appwriteClient.database.listDocuments(
        INGREDIENTS_COLLECTION_ID,
      );

      const ingredients = response.documents as Ingredient[];
      const enrichedIngredients = await this.enrichIngredients(ingredients);
      this._ingredients = enrichedIngredients;
    },

    async searchIngredients(query: string): Promise<void> {
      const response = await appwriteClient.database.listDocuments(
        INGREDIENTS_COLLECTION_ID,
        [Query.search('name', query)],
      );

      const ingredients = response.documents as Ingredient[];
      const enrichedIngredients = await this.enrichIngredients(ingredients);
      this._ingredientSearchResults = enrichedIngredients as Ingredient[];
    },

    resetIngredientSearch(): void {
      this._ingredientSearchResults = [];
    },

    async createIngredient(
      payload: Ingredient,
    ): AppServerResponseOrError<Ingredient> {
      try {
        const response: Ingredient =
          await appwriteClient.database.createDocument(
            INGREDIENTS_COLLECTION_ID,
            uuid(),
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
    }: Ingredient): AppServerResponseOrError<Models.Document> {
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

    async deleteIngredient({ $id }: Ingredient): AppServerResponseOrError<any> {
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

    async uploadIngredientImage(
      file: File,
    ): AppServerResponseOrError<Models.File> {
      try {
        const response = await appwriteClient.storage.createFile(
          INGREDIENTS_BUCKET_ID,
          uuid(),
          file,
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async deleteIngredientImage(fileId: string) {
      try {
        const deletionResponse = await appwriteClient.storage.deleteFile(
          INGREDIENTS_BUCKET_ID,
          fileId,
        );
        return [deletionResponse, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async fetchIngredientImage(fileId: string): Promise<string> {
      if (fileId) {
        const response = await appwriteClient.storage.getFilePreview(
          INGREDIENTS_BUCKET_ID,
          fileId,
        );
        return response.href;
      }
      return '';
    },

    async enrichIngredients(ingredients: Ingredient[]): Promise<Ingredient[]> {
      const enrichedIngredients = await Promise.all(
        ingredients.map(async (ingredient) => {
          const primary_image_href = await this.fetchIngredientImage(
            ingredient.primary_image_id as string,
          );
          return {
            ...ingredient,
            primary_image_href,
          };
        }),
      );
      return enrichedIngredients;
    },
  },
});

export default useIngredientsStore;
