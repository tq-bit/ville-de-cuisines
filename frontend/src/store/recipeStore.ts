import {
  AppGalleryItemType,
  AppPublicUser,
  AppServerResponseOrError,
  Ingredient,
  Recipe,
  SerializedRecipe,
  RecipeCategory,
  RecipeMap,
} from '../@types/commons';
import {
  RECIPES_COLLECTION_ID,
  RECIPE_BUCKET_ID,
  RECIPE_CATEGORY_ID,
} from '../constants';
import { AppwriteException, Models, Query } from 'appwrite';
import { v4 as uuid } from 'uuid';
import useAppAlert from '../use/globalAlert';
import { removeDuplicates } from '../util/array_util';

import { defineStore } from 'pinia';
import appwriteClient from '../api/appwrite';
import usePublicUserStore from './publicUserStore';

const { triggerGlobalAlert } = useAppAlert();

const useRecipeStore = defineStore('recipes', {
  state: () => ({
    _count: 0,
    _publicRecipes: [] as Recipe[],
    _publicUserRecipes: [] as Recipe[], // @see ./publicUserStore
    _publicRecipesByCategory: {} as RecipeMap,
    _activeUserRecipes: [] as Recipe[],
    _recipeCategories: [] as RecipeCategory[],
    _recipeCategorySearchResults: [] as RecipeCategory[],
  }),

  getters: {
    publicRecipes: (state) => state._publicRecipes,
    activeUserRecipes: (state) => state._activeUserRecipes,
    publicUserRecipes: (state) => state._publicUserRecipes,
    publicRecipesByCategory: (state) => (categoryId: string) =>
      state._publicRecipesByCategory[categoryId],
    recipeCategories: (state) => state._recipeCategories,
    recipeCategorySearchResults: (state) => state._recipeCategorySearchResults,

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
    activeUserPublicRecipesForGallery: (state) => {
      return state._activeUserRecipes.map((recipe) => {
        return {
          $id: recipe.$id,
          src: recipe.primary_image_href,
          alt: recipe.name,
          title: recipe.name,
        } as AppGalleryItemType;
      });
    },
    publicRecipesByCategoryForGallery: (state) => {
      return (categoryId: string) => {
        return state._publicRecipesByCategory[categoryId].map((recipe) => {
          return {
            $id: recipe.$id,
            src: recipe.primary_image_href,
            alt: recipe.name,
            title: recipe.name,
          } as AppGalleryItemType;
        });
      };
    },
    publicUserRecipesForGallery: (state) => {
      return state._publicUserRecipes.map((recipe) => {
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
    async syncPublicRecipes(): Promise<void> {
      const response = await appwriteClient.database.listDocuments(
        RECIPES_COLLECTION_ID,
        [Query.equal('is_public', true)],
        10,
      );
      const documents = response.documents as SerializedRecipe[];
      const enrichedDocuments = await this.enrichRecipes(documents);
      this._publicRecipes = enrichedDocuments;
    },

    async syncActiveUserRecipes(userId: string): Promise<void> {
      const response = await appwriteClient.database.listDocuments(
        RECIPES_COLLECTION_ID,
        [Query.equal('user_id', userId)],
      );
      const documents = response.documents as SerializedRecipe[];
      const enrichedDocuments = await this.enrichRecipes(documents);
      this._activeUserRecipes = enrichedDocuments;
    },

    async syncPublicUserRecipes(userId: string): Promise<void> {
      const response = await appwriteClient.database.listDocuments(
        RECIPES_COLLECTION_ID,
        // TODO: Add  Query.equal('is_public', true)  here after explanation
        [Query.equal('user_id', userId)],
      );
      const documents = response.documents as SerializedRecipe[];
      const enrichedDocuments = await this.enrichRecipes(documents);
      this._publicUserRecipes = enrichedDocuments;
    },

    async syncRecipesByCategory(categoryId: string): Promise<void> {
      const response = await appwriteClient.database.listDocuments(
        RECIPES_COLLECTION_ID,
        [Query.equal('category_id', categoryId)],
        5,
      );
      const documents = response.documents as SerializedRecipe[];
      const enrichedDocuments = await this.enrichRecipes(documents);
      this._publicRecipesByCategory[categoryId] = enrichedDocuments;
    },

    async searchCategories(query: string) {
      const response = await appwriteClient.database.listDocuments(
        RECIPE_CATEGORY_ID,
        [Query.search('name', query)],
      );
      this._recipeCategorySearchResults =
        response.documents as RecipeCategory[];
    },

    resetCategorySearch() {
      this._recipeCategorySearchResults = [];
    },

    async fetchRecipeById(recipeId: string): AppServerResponseOrError<Recipe> {
      try {
        const response: SerializedRecipe =
          await appwriteClient.database.getDocument(
            RECIPES_COLLECTION_ID,
            recipeId,
          );

        const deserializedDocument = this.deserializeRecipe(response);
        const enrichedDocument = await this.enrichRecipeWithRemoteData(
          deserializedDocument,
        );

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

    async fetchRecipeCategoryName(categoryId: string): Promise<string> {
      if (categoryId) {
        const response: RecipeCategory =
          await appwriteClient.database.getDocument(
            RECIPE_CATEGORY_ID,
            categoryId,
          );
        return response.name;
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

    patchRecipeUpdatePayload(rawPayload: Recipe) {
      const { username, ...payload } = rawPayload;
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

    async enrichRecipes(documents: SerializedRecipe[]): Promise<Recipe[]> {
      const deserializedDocuments = documents.map((document) => {
        return this.deserializeRecipe(document);
      });

      const enrichedDocuments = await Promise.all(
        deserializedDocuments.map((document) => {
          return this.enrichRecipeWithRemoteData(document);
        }),
      );

      return enrichedDocuments;
    },

    deserializeRecipe(document: SerializedRecipe): Recipe {
      return {
        ...document,
        ingredients: document.ingredients.map((ingredient: string) => {
          return this.deserializeRecipeIngredient(ingredient);
        }),
      };
    },

    async enrichRecipeWithRemoteData(document: Recipe): Promise<Recipe> {
      const userStore = usePublicUserStore();
      const primary_image_href = await this.fetchRecipeImage(
        document.primary_image_id as string,
      );

      const category_name = await this.fetchRecipeCategoryName(
        document.category_id as string,
      );

      const [userResponse, userError] = await userStore.fetchPublicUserById(
        document.user_id as string,
      );

      const { name: username } = userResponse as AppPublicUser;

      return {
        ...document,
        primary_image_href,
        username,
        category_name,
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
