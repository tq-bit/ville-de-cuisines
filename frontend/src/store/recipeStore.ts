import {
  AppGalleryItemType,
  AppServerResponseOrError,
  Ingredient,
  Recipe,
  SerializedRecipe,
} from '../@types/commons';
import { RECIPES_COLLECTION_ID, RECIPE_BUCKET_ID } from '../constants';
import { AppwriteException, Models, Query } from 'appwrite';
import { v4 as uuid } from 'uuid';
import useAppAlert from '../use/globalAlert';
import { removeDuplicates } from '../util/array_util';

import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';

const { triggerGlobalAlert } = useAppAlert();

const useRecipeStore = defineStore('recipes', {
  state: () => ({
    _count: 0,
    _publicRecipes: [] as Recipe[],
    _activeUserRecipes: [] as Recipe[],
  }),

  getters: {
    publicRecipes: (state) => state._publicRecipes,
    activeUserRecipes: (state) => state._activeUserRecipes,
    publicRecipesForGallery: (state) => {
      return state._publicRecipes.map((recipe) => {
        return {
          $id: recipe.$id,
          src: recipe.primary_image_href,
          alt: recipe.name,
          title: recipe.name,
        } as AppGalleryItemType;
      });
    },
    activeUserpublicRecipesForGallery: (state) => {
      return state._activeUserRecipes.map((recipe) => {
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
    async fetchPublicRecipes() {
      const response = await appwriteClient.database.listDocuments(
        RECIPES_COLLECTION_ID,
        [Query.equal('is_public', true)],
        10,
      );
      const documents = response.documents as SerializedRecipe[];
      const deserializedDocuments = await Promise.all(
        documents.map((document) => {
          return this.deserializeRecipe(document);
        }),
      );
      const enrichedDocuments = await Promise.all(
        deserializedDocuments.map((document) => {
          return this.enrichRecipe(document);
        }),
      );
      this._publicRecipes = enrichedDocuments;
    },

    async fetchActiveUserRecipes(userId: string) {
      const response = await appwriteClient.database.listDocuments(
        RECIPES_COLLECTION_ID,
        [Query.equal('user_id', userId)],
      );
      const documents = response.documents as SerializedRecipe[];
      const deserializedDocuments = await Promise.all(
        documents.map((document) => {
          return this.deserializeRecipe(document);
        }),
      );
      const enrichedDocuments = await Promise.all(
        deserializedDocuments.map((document) => {
          return this.enrichRecipe(document);
        }),
      );
      this._activeUserRecipes = enrichedDocuments;
    },

    async fetchRecipeById(recipeId: string): AppServerResponseOrError<Recipe> {
      try {
        const response: SerializedRecipe =
          await appwriteClient.database.getDocument(
            RECIPES_COLLECTION_ID,
            recipeId,
          );

        const deserializedDocument = await this.deserializeRecipe(response);
        const enrichedDocument = await this.enrichRecipe(deserializedDocument);

        return [enrichedDocument, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
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

    async createRecipe(
      payload: Recipe,
      userId: string,
    ): AppServerResponseOrError<Recipe> {
      try {
        const id = uuid();
        const patchedPayload = this.patchRecipeCreationPayload(
          payload,
          id,
          userId,
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

    async updateRecipe(
      payload: Recipe,
    ): AppServerResponseOrError<Models.Document> {
      try {
        const patchedPayload = this.patchRecipeUpdatePayload(payload);
        const response = await appwriteClient.database.updateDocument(
          RECIPES_COLLECTION_ID,
          patchedPayload.$id || '',
          patchedPayload,
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async handleRecipeDeletion(recipeId: string): Promise<void> {
      const [fetchRecipeResponse, fetchRecipeError] =
        await this.fetchRecipeById(recipeId);
      const recipeToDelete = fetchRecipeResponse as Recipe;

      // TODO: add a way to check whether an image exists or not
      const [recipeResponse, recipeError] = await this.deleteRecipe(
        recipeToDelete,
      );
      const [imageResponse, imageError] = await this.deleteRecipeImage(
        recipeToDelete.primary_image_id as string,
      );

      if (fetchRecipeError || recipeError || imageError) {
        triggerGlobalAlert({
          variant: 'error',
          message: 'Could not delete recipe for ' + recipeToDelete.name,
        });
      } else {
        triggerGlobalAlert({
          variant: 'success',
          message: 'Deleted recipe for ' + recipeToDelete.name,
        });
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
        const deletionResponse = await appwriteClient.storage.deleteFile(
          RECIPE_BUCKET_ID,
          fileId,
        );
        return [deletionResponse, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    patchRecipeCreationPayload(
      payload: Recipe,
      id: string,
      userId: string,
    ): SerializedRecipe {
      const ingredients = payload.ingredients.map((ingredient: Ingredient) => {
        return this.serializeRecipeIngredient(ingredient);
      });
      const uniqueIngredients = removeDuplicates(ingredients);
      const uniqueTags = removeDuplicates(payload?.tags);
      return {
        ...payload,
        original_recipe_id: id,
        user_id: userId,
        tags: uniqueTags,
        ingredients: uniqueIngredients as string[],
      };
    },

    patchRecipeUpdatePayload(payload: Recipe) {
      const ingredients = payload.ingredients.map((ingredient: Ingredient) => {
        return this.serializeRecipeIngredient(ingredient);
      });
      const uniqueIngredients = removeDuplicates(ingredients);
      const uniqueTags = removeDuplicates(payload?.tags);
      return {
        ...payload,
        tags: uniqueTags,
        ingredients: uniqueIngredients,
      };
    },

    deserializeRecipe(document: SerializedRecipe): Recipe {
      return {
        ...document,
        ingredients: document.ingredients.map((ingredient: string) => {
          return this.deserializeRecipeIngredient(ingredient);
        }),
      };
    },

    async enrichRecipe(document: Recipe): Promise<Recipe> {
      const primary_image_href = await this.fetchRecipeImage(
        document.primary_image_id as string,
      );

      return {
        ...document,
        primary_image_href,
      };
    },

    serializeRecipeIngredient(ingredeint: Ingredient): string {
      return JSON.stringify(ingredeint);
    },

    deserializeRecipeIngredient(stringifiedIngredient: string): Ingredient {
      return JSON.parse(stringifiedIngredient);
    },

    addRecipeToLocalState(recipe: Recipe) {
      this._activeUserRecipes.push(recipe);
    },
  },
});

export default useRecipeStore;
