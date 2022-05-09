import { Ref } from 'vue';

import recipeStore from '../../store/recipeStore';
import useLazySearch from '../useLazySearch';
import { APP_DEBOUNCE_TIMEOUT } from '../../constants';

const { searchCategories, resetCategorySearch } = recipeStore();

export default function useLazyCategorySearch(query: Ref<string>) {
  const { handleSearch, loading } = useLazySearch(
    () => searchCategories(query.value),
    () => resetCategorySearch(),
    APP_DEBOUNCE_TIMEOUT,
  );

  return { handleSearch, loading };
}
