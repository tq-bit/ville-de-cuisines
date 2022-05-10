import { v4 as uuid } from 'uuid';
import { Models, Query } from 'appwrite';
import Api from '@/api/appwrite';
import {
  RECIPE_CATEGORY_BUCKET_ID,
  RECIPE_CATEGORY_COLLECTION_ID,
} from '@/constants';
import { RecipeCategory } from '@/@types';

export default class IngredientsApi extends Api {
  constructor() {
    super(RECIPE_CATEGORY_COLLECTION_ID, RECIPE_CATEGORY_BUCKET_ID);
  }

  public async createRecipeCategory(recipeCategory: RecipeCategory) {
    return this.stateful<RecipeCategory>(async () => {
      const categoryId = uuid();
      return this.createDocument(categoryId, recipeCategory);
    });
  }

  public async updateRecipeCategory(recipeCategory: RecipeCategory) {
    return this.stateful<RecipeCategory>(async () => {
      return this.updateDocument(recipeCategory);
    });
  }

  public async fetchRecipeCategories() {
    return this.stateful<RecipeCategory[]>(async () => {
      const response = await this.listDocuments();
      const recipeCategories = response.documents as RecipeCategory[];
      const enrichedRecipeCategories = await this.enrichRecipeCategories(
        recipeCategories,
      );
      return enrichedRecipeCategories;
    });
  }

  public async fetchRecipeCategoryById(categoryId: string) {
    return this.stateful<RecipeCategory>(async () => {
      const response = (await this.getDocument(categoryId)) as RecipeCategory;
      const enrichedRecipeCategory = await this.enrichRecipeCategory(response);
      return enrichedRecipeCategory;
    });
  }

  // Category search methods
  public async searchRecipeCategories(query: string) {
    return this.stateful<RecipeCategory[]>(async () => {
      const response = await this.listDocuments([Query.search('name', query)]);
      const recipeCategories = response.documents as RecipeCategory[];
      const enrichedRecipeCategories = await this.enrichRecipeCategories(
        recipeCategories,
      );
      return enrichedRecipeCategories;
    });
  }

  // Category image CRUD
  public async fetchRecipeCategoryImage(fileId: string) {
    if (fileId) {
      const response = await this.getFilePreview(fileId);
      return response.href;
    }
    return '';
  }

  public async uploadRecipeCategoryImage(file: File) {
    return this.stateful<Models.File>(() => {
      return this.uploadFile(file);
    });
  }

  public async deleteRecipeCategoryImage(fileId: string) {
    return this.stateful(() => {
      return this.deleteFile(fileId);
    });
  }

  private async enrichRecipeCategories(recipeCategories: RecipeCategory[]) {
    const enrichedRecipeCategories = await Promise.all(
      recipeCategories.map(async (recipeCategory) => {
        return this.enrichRecipeCategory(recipeCategory);
      }),
    );
    return enrichedRecipeCategories;
  }

  private async enrichRecipeCategory(recipeCategory: RecipeCategory) {
    const primary_image_href = await this.fetchRecipeCategoryImage(
      recipeCategory.primary_image_id as string,
    );
    return {
      ...recipeCategory,
      primary_image_href,
    };
  }
}
