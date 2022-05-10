import {
  AppServerResponseOrError,
  Ingredient,
  AppGalleryItemType,
} from '../@types/index';
import ingredients_fallback_url from '/ingredients-fallback.png';
import { INGREDIENTS_COLLECTION_ID, INGREDIENTS_BUCKET_ID } from '../constants';
import { AppwriteException, Models, Query } from 'appwrite';
import { v4 as uuid } from 'uuid';
import IngredientsApi from '../api/resources/ingredients.api';

import { defineStore } from 'pinia';
import { appwriteClient } from '../api/appwrite';

const api = new IngredientsApi();

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

    ingredientsForGallery:(state) => {
      return state._ingredients.map((ingredient) => {
        return {
          $id: ingredient.$id,
          src: ingredient.primary_image_href,
          alt: ingredient.name,
          title: ingredient.name,
          text: `Adds ${(ingredient.calories / ingredient.quantity).toFixed(
            2,
          )} kcal / ${ingredient.quantity_unit}`,
          type: 'ingredient',
        } as AppGalleryItemType;
      });
    },
    ingredientSearchResultsForGallery: (state) => {
      return state._ingredientSearchResults.map((ingredient) => {
        return {
          $id: ingredient.$id,
          src: ingredient.primary_image_href,
          alt: ingredient.name,
          title: ingredient.name,
          text: `Adds ${(ingredient.calories / ingredient.quantity).toFixed(
            2,
          )} kcal / ${ingredient.quantity_unit}`,
          type: 'ingredient',
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
      const [response, error] = await api.fetchIngredients();
      if (response) {
        this._ingredients = response;
      }
    },

    async searchIngredients(query: string): Promise<void> {
      const [response, error] = await api.searchIngredientsByName(query);
      if (response) {
        this._ingredientSearchResults = response;
      }
    },

    resetIngredientSearch(): void {
      this._ingredientSearchResults = [];
    },
  },
});

export default useIngredientsStore;
