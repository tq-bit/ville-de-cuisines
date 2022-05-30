import { defineStore } from 'pinia';
import {
  AppGalleryItemType,
  Recipe,
  RecipeCategory,
  RecipeMap,
  AppGalleryRecipeItem,
} from '@/@types/';
import recipesApi from '@/api/recipes.api';
import categoriesApi from '@/api/recipeCategories.api';

const generateRecipeText = (recipe: Recipe) => {
  const textCalories = ` has ${recipe.calories_per_portion} calories per portion`;
  const textTime = ` takes ${recipe.total_cooking_time} minutes to prepare`;
  const generateText = () => {
    let localText = '';
    if (recipe.calories_per_portion) {
      localText += recipe.name + textCalories;
    }

    if (recipe.calories_per_portion && recipe.total_cooking_time) {
      localText += ' and ';
    }
    if (recipe.total_cooking_time) {
      localText += `\n\n ${textTime}`;
    }
    return localText;
  };
  return generateText();
};

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
        const text = generateRecipeText(recipe);
        return {
          $id: recipe.$id,
          src: recipe.primary_image_href,
          alt: recipe.name,
          title: recipe.name,
          text,
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
          calories_per_portion: recipe.calories_per_portion,
          total_cooking_time: recipe.total_cooking_time,
        } as AppGalleryRecipeItem;
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
            calories_per_portion: recipe.calories_per_portion,
            total_cooking_time: recipe.total_cooking_time,
          } as AppGalleryRecipeItem;
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
            calories_per_portion: recipe.calories_per_portion,
            total_cooking_time: recipe.total_cooking_time,
          } as AppGalleryRecipeItem;
        });
      };
    },

    publicRecipesByIngredientForGallery: (state) => {
      return (ingredientId: string) => {
        return state._publicRecipesByIngredient[ingredientId].map((recipe) => {
          return {
            $id: recipe.$id,
            src: recipe.primary_image_href,
            alt: recipe.name,
            title: recipe.name,
            calories_per_portion: recipe.calories_per_portion,
            total_cooking_time: recipe.total_cooking_time,
          } as AppGalleryRecipeItem;
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
          calories_per_portion: recipe.calories_per_portion,
          total_cooking_time: recipe.total_cooking_time,
        } as AppGalleryRecipeItem;
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
        const text = generateRecipeText(recipe);
        return {
          $id: recipe.$id,
          src: recipe.primary_image_href,
          alt: recipe.name,
          title: recipe.name,
          text,
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
