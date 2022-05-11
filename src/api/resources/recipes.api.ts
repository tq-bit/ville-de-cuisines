import { v4 as uuid } from 'uuid';
import { Models, Query } from 'appwrite';
import { Recipe, Ingredient, SerializedRecipe } from '@/@types';
import { RECIPE_BUCKET_ID, RECIPES_COLLECTION_ID } from '@/constants';
import Api from '@/api/appwrite';
import { removeDuplicates } from '@/util/array_util';

import categoriesApi from './recipeCategories.api';
import publicUserApi from './publicUser.api';

import recipeFallbackUrl from '/recipe-fallback.webp';

class RecipesApi extends Api {
  constructor() {
    super(RECIPES_COLLECTION_ID, RECIPE_BUCKET_ID);
  }

  public async createRecipe(recipe: Recipe, userId: string) {
    return this.stateful<Recipe>(async () => {
      const id = uuid();
      const patchedRecipe = this.patchRecipeCreationPayload(recipe, id, userId);
      return this.createDocument(id, patchedRecipe);
    });
  }

  public async updateRecipe(recipe: Recipe) {
    return this.stateful<Recipe>(async () => {
      const patchedRecipe = this.patchRecipeUpdatePayload(recipe);
      return this.updateDocument(patchedRecipe);
    });
  }

  public async deleteRecipe(recipeId: string) {
    return this.stateful(async () => {
      return this.deleteDocument(recipeId);
    });
  }

  public async fetchPublicRecipes() {
    return this.stateful<Recipe[]>(async () => {
      const response = await this.listDocuments();
      const recipes = response.documents as SerializedRecipe[];
      return this.enrichRecipeList(recipes);
    });
  }

  public async fetchPublicRecipeById(recipeId: string) {
    return this.stateful<Recipe>(async () => {
      const response = (await this.getDocument(recipeId)) as SerializedRecipe;
      const enrichedRecipe = await this.enrichRecipe(response);
      return enrichedRecipe;
    });
  }

  public async fetchPublicRecipesByCategory(categoryId: string, count: number) {
    return this.stateful<Recipe[]>(async () => {
      const response = await this.listDocuments(
        [Query.equal('category_id', categoryId)],
        count,
      );
      const recipes = response.documents as SerializedRecipe[];
      const enrichedRecipes = this.enrichRecipeList(recipes);
      return enrichedRecipes;
    });
  }

  public async fetchPublicRecipesByUser(userId: string, count: number) {
    return this.stateful<Recipe[]>(async () => {
      const response = await this.listDocuments(
        [Query.equal('user_id', userId)],
        count,
      );
      const recipes = response.documents as SerializedRecipe[];
      const enrichedRecipes = this.enrichRecipeList(recipes);
      return enrichedRecipes;
    });
  }

  public async fetchPublicRecipesByIngredient(
    ingredientId: string,
    count: number,
  ) {
    return this.stateful<Recipe[]>(async () => {
      const response = await this.listDocuments(
        [Query.search('ingredients', ingredientId)],
        count,
      );
      const recipes = response.documents as SerializedRecipe[];
      return this.enrichRecipeList(recipes);
    });
  }

  // Recipe Image CRUD
  public uploadRecipeImage(file: File) {
    return this.stateful<Models.File>(async () => {
      return this.uploadFile(file);
    });
  }

  public deleteRecipeImage(fileId: string) {
    return this.stateful(async () => {
      return this.deleteFile(fileId);
    });
  }

  // Recipe search methods
  public async searchRecipes(query: string) {
    return this.stateful<Recipe[]>(async () => {
      const response = await this.listDocuments([Query.search('name', query)]);
      const recipes = response.documents as SerializedRecipe[];
      const enrichedRecipes = this.enrichRecipeList(recipes);
      return enrichedRecipes;
    });
  }

  // Recipe patching methods
  private patchRecipeCreationPayload(
    recipe: Recipe,
    id: string,
    userId: string,
  ) {
    const serializedIngredients = recipe.ingredients.map(
      (ingredient: Ingredient) => {
        return JSON.stringify(ingredient);
      },
    );
    const uniqueIngredients = removeDuplicates(serializedIngredients);
    const uniqueTags = removeDuplicates(recipe?.tags);

    return {
      ...recipe,
      original_recipe_id: recipe.original_recipe_id || id,
      user_id: userId,
      tags: uniqueTags,
      ingredients: uniqueIngredients as string[],
    };
  }

  private patchRecipeUpdatePayload(rawRecipe: Recipe) {
    const { username, ...recipe } = rawRecipe;
    const serializedIngredients = recipe.ingredients.map(
      (ingredient: Ingredient) => {
        return JSON.stringify(ingredient);
      },
    );
    const uniqueIngredients = removeDuplicates(serializedIngredients);
    const uniqueTags = removeDuplicates(recipe?.tags);
    return {
      ...recipe,
      tags: uniqueTags,
      ingredients: uniqueIngredients,
    };
  }

  // Recipe enrichment methods
  private async enrichRecipeList(
    recipes: SerializedRecipe[],
  ): Promise<Recipe[]> {
    return Promise.all(recipes.map((recipe) => this.enrichRecipe(recipe)));
  }

  private async enrichRecipe(recipe: SerializedRecipe): Promise<Recipe> {
    const deserlializedRecipe = this.deserializeRecipe(recipe);
    const totalCalories = deserlializedRecipe.ingredients.reduce(
      (acc, ingredient) => {
        return (acc += ingredient.calories);
      },
      0,
    );
    const [category, categoryError] =
      await categoriesApi.fetchRecipeCategoryById(recipe.category_id || '');

    const primaryImageHref = await this.getRecipeImagePreview(
      deserlializedRecipe.primary_image_id,
    );

    const [user, userError] = await publicUserApi.fetchPublicUserById(
      recipe.user_id,
    );

    // TODO: Add recipe category here
    return {
      ...deserlializedRecipe,
      primary_image_href: primaryImageHref,
      total_calories: totalCalories,
      category_name: category?.name,
      username: user?.name || '',
    };
  }

  private async getRecipeImagePreview(fileId?: string): Promise<string> {
    if (fileId) {
      const response = await this.getFilePreview(fileId);
      return response.href;
    }
    return recipeFallbackUrl;
  }

  // Serialization methods
  private serializeRecipeList(recipes: Recipe[]): SerializedRecipe[] {
    return recipes.map((recipe) => this.serializeRecipe(recipe));
  }

  private deserializeRecipeList(recipes: SerializedRecipe[]): Recipe[] {
    return recipes.map((recipe) => this.deserializeRecipe(recipe));
  }

  private serializeRecipe(recipe: Recipe): SerializedRecipe {
    const serializedIngredients = recipe.ingredients.map(
      (ingredient: Ingredient) => {
        return JSON.stringify(ingredient);
      },
    );
    const uniqueIngredients = removeDuplicates(serializedIngredients);
    const uniqueTags = removeDuplicates(recipe?.tags);
    return {
      ...recipe,
      tags: uniqueTags,
      ingredients: uniqueIngredients || [],
    };
  }

  private deserializeRecipe(recipe: SerializedRecipe): Recipe {
    const ingredients = recipe.ingredients.map((ingredient) => {
      return JSON.parse(ingredient);
    });
    return {
      ...recipe,
      ingredients,
    };
  }
}
export default new RecipesApi();
