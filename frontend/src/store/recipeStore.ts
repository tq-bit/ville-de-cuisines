import {
  AppServerResponseOrError,
  Ingredient,
  Recipe,
  SerializedRecipe,
} from '../@types/commons';
import { RECIPES_COLLECTION_ID } from '../constants';
import { AppwriteException } from 'appwrite';
import { v4 as uuid } from 'uuid';

import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';
import activeUserStore from './activeUserStore';

const { user: activeUser } = activeUserStore();

const ingredientsStore = defineStore('recipes', {
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
      const documents = response.documents as SerializedRecipe[];
      const deserializedDocuments = this.patchRecipeFetchPayload(documents);
      this._recipes = deserializedDocuments;
    },

    async createRecipe(payload: Recipe): AppServerResponseOrError {
      try {
        const id = uuid();
        const patchedPayload = this.patchRecipeCreationPayload(
          payload,
          activeUser.name,
          id,
        );
        const response: Recipe = await appwriteClient.database.createDocument(
          RECIPES_COLLECTION_ID,
          id,
          patchedPayload,
        );
        this.addRecipeToLocalState(response);
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

    patchRecipeCreationPayload(
      payload: Recipe,
      username: string,
      id: string,
    ): SerializedRecipe {
      return {
        ...payload,
        original_recipe_id: id,
        username: username,
        ingredients: payload.ingredients.map((ingredient: Ingredient) => {
          return this.serializeRecipeIngredient(ingredient);
        }),
      };
    },

    patchRecipeFetchPayload(documents: SerializedRecipe[]): Recipe[] {
      return documents.map((document: SerializedRecipe) => {
        return {
          ...document,
          ingredients: document.ingredients.map((ingredient: string) => {
            return this.deserializeRecipeIngredient(ingredient);
          }),
        };
      });
    },

    serializeRecipeIngredient(ingredeint: Ingredient): string {
      return JSON.stringify(ingredeint);
    },

    deserializeRecipeIngredient(stringifiedIngredient: string): Ingredient {
      return JSON.parse(stringifiedIngredient);
    },

    addRecipeToLocalState(recipe: Recipe) {
      this._recipes.push(recipe);
    },
  },
});

export default ingredientsStore;
