import { Models, Query } from 'appwrite';
import Api from '../appwrite';
import { RECIPE_BUCKET_ID, RECIPES_COLLECTION_ID } from '../../constants';
import {
  AppServerResponseOrError,
  Recipe,
  Ingredient,
  SerializedRecipe,
} from '../../@types';
import { removeDuplicates } from '../../util/array_util';

export default class RecipesApi extends Api {
  constructor() {
    super(RECIPES_COLLECTION_ID, RECIPE_BUCKET_ID);
  }

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
    const primaryImageHref = this.getRecipeImagePreview(
      deserlializedRecipe.primary_image_href,
    );

    return {
      ...deserlializedRecipe,
      primary_image_href: primaryImageHref,
      total_calories: totalCalories,
    };
  }

  private deserializeRecipeList(recipes: SerializedRecipe[]): Recipe[] {
    return recipes.map((recipe) => this.deserializeRecipe(recipe));
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

  private getRecipeImagePreview(fileId?: string): string {
    if (fileId) {
      const response = this.getFilePreview(fileId);
      return response.href;
    }
    return '';
  }

  private serializeRecipeIngredients(ingredient: Ingredient): string {
    return JSON.stringify(ingredient);
  }
}
