import { Ref } from 'vue';

import recipeStore from '../../store/recipeStore';
import useLazySearch from '../useLazySearch';
import { APP_DEBOUNCE_TIMEOUT } from '../../constants';

export default function useLazyRecipeSearch(query: Ref<string>) {
  const { searchRecipes, resetRecipeSearch } = recipeStore();
  const { handleSearch, loading } = useLazySearch(
    () => searchRecipes(query.value),
    () => resetRecipeSearch(),
    APP_DEBOUNCE_TIMEOUT,
  );

  return { handleSearch, loading };
}
