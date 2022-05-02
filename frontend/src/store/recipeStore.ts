import {
  AppGalleryItemType,
  AppServerResponseOrError,
  Ingredient,
  Recipe,
  SerializedRecipe,
} from '../@types/commons';
import { RECIPES_COLLECTION_ID, RECIPE_BUCKET_ID } from '../constants';
import { AppwriteException, Models } from 'appwrite';
import { v4 as uuid } from 'uuid';

import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';
import useActiveUserStore from './activeUserStore';

const activeUserStore = useActiveUserStore();

const useRecipeStore = defineStore('recipes', {
  state: () => ({
    _count: 0,
    _recipes: [] as Recipe[],
  }),

  getters: {
    recipes: (state) => state._recipes,
    recipesForGallery: (state) => {
      return state._recipes.map((recipe) => {
        return {
          $id: recipe.$id,
          src: recipe.primary_image_href,
          alt: recipe.name,
          title: recipe.name,
        } as AppGalleryItemType;
      });
    },
  },

  actions: {
    async fetchRecipes() {
      const response = await appwriteClient.database.listDocuments(
        RECIPES_COLLECTION_ID,
      );
      const documents = response.documents as SerializedRecipe[];
      const deserializedDocuments = this.deserializeRecipes(documents);
      const enrichedDocuments = await this.enrichRecipes(deserializedDocuments);
      this._recipes = enrichedDocuments;
    },

    async createRecipe(payload: Recipe): AppServerResponseOrError<Recipe> {
      try {
        const id = uuid();
        const patchedPayload = this.patchRecipeCreationPayload(payload, id);
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

    async updateRecipe({
      $id,
      ...payload
    }: Recipe): AppServerResponseOrError<Models.Document> {
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

    async deleteRecipe({ $id }: Recipe): AppServerResponseOrError<any> {
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

    async uploadRecipeImage(file: File): AppServerResponseOrError<Models.File> {
      try {
        const response = await appwriteClient.storage.createFile(
          RECIPE_BUCKET_ID,
          uuid(),
          file,
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async deleteRecipeImage(fileId: string) {
      try {
        const response = await appwriteClient.storage.deleteFile(
          RECIPE_BUCKET_ID,
          fileId,
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    patchRecipeCreationPayload(payload: Recipe, id: string): SerializedRecipe {
      return {
        ...payload,
        original_recipe_id: id,
        user_id: activeUserStore.account.$id,
        ingredients: payload.ingredients.map((ingredient: Ingredient) => {
          return this.serializeRecipeIngredient(ingredient);
        }),
      };
    },

    deserializeRecipes(documents: SerializedRecipe[]): Recipe[] {
      return documents.map((document: SerializedRecipe) => {
        return {
          ...document,
          ingredients: document.ingredients.map((ingredient: string) => {
            return this.deserializeRecipeIngredient(ingredient);
          }),
        };
      });
    },

    enrichRecipes(documents: Recipe[]): Promise<Recipe[]> {
      // TODO: add enrichment for users here when user store is ready
      const documentPromises = documents.map(async (document: Recipe) => {
        const primary_image_href = await this.fetchRecipeImage(
          document.primary_image_id as string,
        );

        return {
          ...document,
          primary_image_href,
        };
      });

      return Promise.all(documentPromises);
    },

    async fetchRecipeImage(fileId: string): Promise<string> {
      if (fileId) {
        const response = await appwriteClient.storage.getFilePreview(
          RECIPE_BUCKET_ID,
          fileId,
        );
        return response.href;
      }
      return '';
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

export default useRecipeStore;
