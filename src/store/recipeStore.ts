import { defineStore } from 'pinia';
import {
  AppGalleryItemType,
  Recipe,
  RecipeCategory,
  RecipeMap,
} from '@/@types/index';
import RecipesApi from '@/api/resources/recipes.api';
import CategoriesApi from '@/api/resources/recipeCategories.api';

const recipesApi = new RecipesApi();
const categoriesApi = new CategoriesApi();

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
      if (response) {
        this._publicRecipeSearchResults = response;
      }
    },

    resetRecipeSearch() {
      this._publicRecipeSearchResults = [];
    },

    async syncRecipeCategories() {
      const [categories, error] = await categoriesApi.fetchRecipeCategories();
      if (categories) {
        this._recipeCategories = categories;
      }
    },

    async searchCategories(query: string) {
      const [response, error] = await categoriesApi.searchRecipeCategories(
        query,
      );
      if (response) {
        this._recipeCategorySearchResults = response;
      }
    },

    resetCategorySearch() {
      this._recipeCategorySearchResults = [];
    },
  },
});

export default useRecipeStore;
