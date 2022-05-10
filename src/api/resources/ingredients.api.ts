import { v4 as uuid } from 'uuid';
import { Models, Query } from 'appwrite';
import { AppServerResponseOrError, Ingredient } from '@/@types';
import { INGREDIENTS_BUCKET_ID, INGREDIENTS_COLLECTION_ID } from '@/constants';
import Api from '@/api/appwrite';
import ingredientsFallbackUrl from '/ingredients-fallback.webp';

export default class IngredientsApi extends Api {
  constructor() {
    super(INGREDIENTS_COLLECTION_ID, INGREDIENTS_BUCKET_ID);
  }

  public async createIngredient(ingredient: Ingredient) {
    return this.stateful<Ingredient>(async () => {
      const id = uuid();
      return (await this.createDocument(id, ingredient)) as Ingredient;
    });
  }

  public async uploadIngredientImage(file: File) {
    return this.stateful<Models.File>(async () => {
      return await this.uploadFile(file);
    });
  }

  public async updateIngredient(ingredient: Ingredient) {
    return this.stateful<Ingredient>(async () => {
      return (await this.updateDocument(ingredient)) as Ingredient;
    });
  }

  public async deleteIngredient(ingredient: Ingredient) {
    return this.stateful(async () => {
      return await this.deleteDocument(ingredient.$id);
    });
  }

  public async deleteIngredientImage(fileId: string) {
    return this.stateful(async () => {
      return await this.deleteFile(fileId);
    });
  }

  public async fetchIngredients() {
    return this.stateful<Ingredient[]>(async () => {
      const response = await this.listDocuments();
      const ingredients = response.documents as Ingredient[];
      const enrichedIngredients = await this.enrichIngredients(ingredients);
      return enrichedIngredients;
    });
  }

  public async fetchIngredientById(ingredientId: string) {
    return this.stateful<Ingredient>(async () => {
      const response = (await this.getDocument(ingredientId)) as Ingredient;
      const enrichedIngredient = await this.enrichIngredient(response);
      return enrichedIngredient;
    });
  }

  public searchIngredientsByName(
    query: string,
  ): AppServerResponseOrError<Ingredient[]> {
    return this.stateful<Ingredient[]>(async () => {
      const response = await this.listDocuments([Query.search('name', query)]);
      const ingredients = response.documents as Ingredient[];
      const enrichedIngredients = await this.enrichIngredients(ingredients);
      return enrichedIngredients;
    });
  }

  private async enrichIngredients(
    ingredients: Ingredient[],
  ): Promise<Ingredient[]> {
    return Promise.all(
      ingredients.map(async (ingredient) => {
        const enrichedIngredient = await this.enrichIngredient(ingredient);
        return enrichedIngredient;
      }),
    );
  }

  private async enrichIngredient(ingredient: Ingredient): Promise<Ingredient> {
    const primary_image_href = await this.getIngredientImagePreview(
      ingredient.primary_image_id as string,
    );
    return {
      ...ingredient,
      primary_image_href,
    };
  }

  private async getIngredientImagePreview(fileId: string): Promise<string> {
    if (fileId) {
      const response = this.getFilePreview(fileId);
      return response.href;
    }
    return ingredientsFallbackUrl;
  }
}
