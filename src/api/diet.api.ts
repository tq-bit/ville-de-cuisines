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

  public createDietEntry(dietEntry: DietEntry) {
    return this.stateful(async () => {
      return await this.createDocument(uuid(), dietEntry);
    });
  }

  public deleteDietEntry(dietEntryId: string) {
    return this.stateful(async () => {
      const response = await this.listDocuments([
        Query.equal('entity_id', dietEntryId),
      ]);
      const dietEntry = response.documents[0] as DietEntry;
      return await this.deleteDocument(dietEntry.$id);
    });
  }

  public async fetchDietEntriesByUser(userId: string) {
    return this.stateful(async () => {
      const response = await this.listDocuments([
        Query.equal('user_id', userId),
      ]);
      const dietEntries = response.documents as DietEntry[];
      return this.enrichDietEntryList(dietEntries);
    });
  }

  private async enrichDietEntryList(dietEntries: DietEntry[]) {
    return Promise.all(
      dietEntries.map((dietEntry) => this.enrichDietEntry(dietEntry)),
    );
  }

  // FIXME: This method must also work for non-public recipes
  private async enrichDietEntry(dietEntry: DietEntry) {
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
