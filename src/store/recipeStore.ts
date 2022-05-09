import {
  AppGalleryItemType,
  AppPublicUser,
  AppServerResponseOrError,
  Ingredient,
  Recipe,
  SerializedRecipe,
  RecipeCategory,
  RecipeMap,
} from '../@types/index';
import {
  RECIPES_COLLECTION_ID,
  RECIPE_BUCKET_ID,
  RECIPE_CATEGORY_BUCKET_ID,
  RECIPE_CATEGORY_COLLECTION_ID,
} from '../constants';
import recipe_fallback_url from '/recipe-fallback.png';
import { AppwriteException, Models, Query } from 'appwrite';
import { v4 as uuid } from 'uuid';
import useAppAlert from '../use/globalAlert';
import { removeDuplicates } from '../util/array_util';

import { defineStore } from 'pinia';
import { appwriteClient } from '../api/appwrite';
import usePublicUserStore from './publicUserStore';
import RecipesApi from '../api/resources/recipes.api';

const { triggerGlobalAlert } = useAppAlert();

const recipesApi = new RecipesApi();

const useRecipeStore = defineStore('recipes', {
  state: () => ({
    _count: 0,
    _publicRecipes: [] as Recipe[],
    _publicRecipeSearchResults: [] as Recipe[],
    _publicUserRecipes: [] as Recipe[], // @see ./publicUserStore
    _publicRecipesByCategory: {} as RecipeMap,
    _publicRecipesByUser: {} as RecipeMap,
    _publicRecipesByIngredient: {} as RecipeMap,
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
    publicRecipesByUser: (state) => (userId: string) =>
      state._publicRecipesByUser[userId],
    publicRecipesByIngredient: (state) => (ingredientId: string) => {
      state._publicRecipesByIngredient[ingredientId];
    },
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
    publicRecipesByUserForGallery: (state) => {
      return (userId: string) => {
        return state._publicRecipesByUser[userId].map((recipe) => {
          return {
            $id: recipe.$id,
            src: recipe.primary_image_href,
            alt: recipe.name,
            title: recipe.name,
          } as AppGalleryItemType;
        });
      };
    },
    publicRecipesByIngredientForGallery: (state) => {
      return (ingredientId: string) => {
        return state._publicRecipesByIngredient[ingredientId].map(
          (ingredient) => {
            return {
              $id: ingredient.$id,
              src: ingredient.primary_image_href,
              alt: ingredient.name,
              title: ingredient.name,
            } as AppGalleryItemType;
          },
        );
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
    recipeCategoriesForGallery: (state) => {
      return state._recipeCategories.map((recipeCategory) => {
        return {
          $id: recipeCategory.$id,
          src: recipeCategory.primary_image_href,
          alt: recipeCategory.name,
          title: recipeCategory.name,
        } as AppGalleryItemType;
      });
    },

    publicRecipeSearchResultsForGallery: (state) => {
      return state._publicRecipeSearchResults.map((recipe) => {
        return {
          $id: recipe.$id,
          src: recipe.primary_image_href,
          alt: recipe.name,
          title: recipe.name,
          type: 'recipe',
        } as AppGalleryItemType;
      });
    },
    recipeCategorySearchResultsForGallery: (state) => {
      return state._recipeCategorySearchResults.map((recipeCategory) => {
        return {
          $id: recipeCategory.$id,
          src: recipeCategory.primary_image_href,
          alt: recipeCategory.name,
          title: recipeCategory.name,
          type: 'category',
        } as AppGalleryItemType;
      });
    },
  },

  actions: {
    async syncPublicRecipes(): Promise<void> {
      const [recipes, error] = await recipesApi.fetchPublicRecipes();
      if (recipes) {
        this._publicRecipes = recipes;
      }
    },

    async syncActiveUserRecipes(userId: string): Promise<void> {
      const [recipes, error] = await recipesApi.fetchPublicRecipesByUser(
        userId,
        10,
      );
      if (recipes) {
        this._activeUserRecipes = recipes;
      }
    },

    async syncPublicUserRecipes(userId: string): Promise<void> {
      const [recipes, error] = await recipesApi.fetchPublicRecipesByUser(
        userId,
        10,
      );
      if (recipes) {
        this._publicUserRecipes = recipes;
      }
    },

    async syncRecipeCategories() {
      const response = await appwriteClient.database.listDocuments(
        RECIPE_CATEGORY_COLLECTION_ID,
      );
      const documents = response.documents as RecipeCategory[];
      const enrichedDocuments = await this.enrichRecipeCategories(documents);
      this._recipeCategories = enrichedDocuments;
    },

    async syncRecipesByCategory(
      categoryId: string,
      count: number = 10,
    ): Promise<void> {
      const [recipes, error] = await recipesApi.fetchPublicRecipesByCategory(
        categoryId,
        count,
      );
      if (recipes) {
        this._publicRecipesByCategory[categoryId] = recipes;
      }
    },

    async syncRecipesByUser(userId: string, count: number): Promise<void> {
      const [response, error] = await recipesApi.fetchPublicRecipesByUser(
        userId,
        count,
      );
      if (response) {
        this, (this._publicRecipesByUser[userId] = response);
      }
    },

    async syncRecipesByIngredient(ingredientId: string, count: number = 9) {
      const [response, error] = await recipesApi.fetchPublicRecipesByIngredient(
        ingredientId,
        count,
      );
      if (response) {
        this._publicRecipesByIngredient[ingredientId] = response;
      }
    },

    async searchRecipes(query: string) {
      const [response, error] = await recipesApi.searchRecipes(query);
      console.log(response);
      if (response) {
        this._publicRecipeSearchResults = response;
      }
    },

    resetRecipeSearch() {
      this._publicRecipeSearchResults = [];
    },

    async searchCategories(query: string) {
      const response = await appwriteClient.database.listDocuments(
        RECIPE_CATEGORY_COLLECTION_ID,
        [Query.search('name', query)],
      );

      const categories = response.documents as RecipeCategory[];
      const enrichedCategories = await this.enrichRecipeCategories(categories);
      this._recipeCategorySearchResults = enrichedCategories;
    },

    resetCategorySearch() {
      this._recipeCategorySearchResults = [];
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

    async fetchRecipeCategoryImage(fileId: string) {
      if (fileId) {
        const response = await appwriteClient.storage.getFilePreview(
          RECIPE_CATEGORY_BUCKET_ID,
          fileId,
        );
        return response.href;
      }
      return '';
    },

    async fetchRecipeCategoryById(
      categoryId: string,
    ): AppServerResponseOrError<RecipeCategory> {
      try {
        const response: RecipeCategory =
          await appwriteClient.database.getDocument(
            RECIPE_CATEGORY_COLLECTION_ID,
            categoryId,
          );
        const primary_image_href = await this.fetchRecipeCategoryImage(
          response.primary_image_id as string,
        );
        const enrichedCategory = {
          ...response,
          primary_image_href,
        };
        return [enrichedCategory, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async fetchRecipeCategoryName(categoryId: string): Promise<string> {
      if (categoryId) {
        const response: RecipeCategory =
          await appwriteClient.database.getDocument(
            RECIPE_CATEGORY_COLLECTION_ID,
            categoryId,
          );
        return response.name;
      }
      return '';
    },

    // Recipe Category CRUD
    async createRecipeCategory(
      payload: RecipeCategory,
    ): AppServerResponseOrError<RecipeCategory> {
      try {
        const response: RecipeCategory =
          await appwriteClient.database.createDocument(
            RECIPE_CATEGORY_COLLECTION_ID,
            uuid(),
            payload,
          );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async updateRecipeCategory(
      payload: RecipeCategory,
    ): AppServerResponseOrError<RecipeCategory> {
      try {
        const response: RecipeCategory =
          await appwriteClient.database.updateDocument(
            RECIPE_CATEGORY_COLLECTION_ID,
            payload.$id || '',
            payload,
          );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    // Recipe Category Image CRUD
    async uploadRecipeCategoryImage(
      file: File,
    ): AppServerResponseOrError<Models.File> {
      try {
        const response = await appwriteClient.storage.createFile(
          RECIPE_CATEGORY_BUCKET_ID,
          uuid(),
          file,
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async deleteRecipeCategoryImage(fileId: string) {
      try {
        const deletionResponse = await appwriteClient.storage.deleteFile(
          RECIPE_CATEGORY_BUCKET_ID,
          fileId,
        );
        return [deletionResponse, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async enrichRecipeCategories(documents: RecipeCategory[]) {
      const enrichedRecipeCategories = await Promise.all(
        documents.map(async (document) => {
          const primary_image_href = await this.fetchRecipeCategoryImage(
            document.primary_image_id as string,
          );
          return {
            ...document,
            primary_image_href,
          };
        }),
      );
      return enrichedRecipeCategories;
    },
  },
});

export default useRecipeStore;
