import { Ref } from 'vue';

import recipeStore from '../../store/recipeStore';
import useLazySearch from '../useLazySearch';
import { APP_DEBOUNCE_TIMEOUT } from '../../constants';

export default function useLazyCategorySearch(query: Ref<string>) {
  const { searchCategories, resetCategorySearch } = recipeStore();
  const { handleSearch, loading } = useLazySearch(
    () => searchCategories(query.value),
    () => resetCategorySearch(),
    APP_DEBOUNCE_TIMEOUT,
  );

  return { handleSearch, loading };
}
