import { v4 as uuid } from 'uuid';
import { Query } from 'appwrite';
import { DietEntry } from '@/@types';
import { DIET_COLLECTION_ID } from '@/constants';
import Api from '@/classes/AppWrite';
import recipesApi from './recipes.api';

class DietApi extends Api {
  constructor() {
    super(DIET_COLLECTION_ID, '');
  }

  public createDiet(dietEntry: DietEntry) {
    return this.stateful(async () => {
      return await this.createDocument(uuid(), dietEntry);
    });
  }

  public deleteDiet(dietEntryId: string) {
    return this.stateful(async () => {
      return await this.deleteDocument(dietEntryId);
    });
  }

  public async fetchDietsByUserId(userId: string) {
    return this.stateful(async () => {
      const response = await this.listDocuments([
        Query.equal('user_id', userId),
      ]);
      const dietEntries = response.documents as DietEntry[];
      return this.enrichDietList(dietEntries);
    });
  }

  public async fetchDietsByUserIdAndDate(
    userId: string,
    from: number,
    to: number,
  ) {
    return this.stateful(async () => {
      const response = await this.listDocuments([
        Query.equal('user_id', userId),
        Query.greaterEqual('date_unix', from),
        Query.lesserEqual('date_unix', to),
      ]);
      const dietEntries = response.documents as DietEntry[];
      return this.enrichDietList(dietEntries);
    });
  }

  private async enrichDietList(dietEntries: DietEntry[]) {
    return Promise.all(
      dietEntries.map((dietEntry) => this.enrichDiet(dietEntry)),
    );
  }

  // FIXME: This method must also work for non-public recipes
  private async enrichDiet(dietEntry: DietEntry) {
    const [recipe, recipeError] = await recipesApi.fetchPublicRecipeById(
      dietEntry.recipe_id,
    );
    if (recipe) {
      dietEntry.recipe = recipe;
    }
    return dietEntry;
  }
}

export default new DietApi();
