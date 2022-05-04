import { Ref } from 'vue';

import recipeStore from '../../store/recipeStore';
import useLazySearch from '../useLazySearch';
import { LAZY_SEARCH_TIMEOUT } from '../../constants';

const { searchCategories, resetCategorySearch } = recipeStore();

export default function useLazyIngredientSearch(query: Ref<string>) {
  const { handleSearch, loading } = useLazySearch(
    () => searchCategories(query.value),
    () => resetCategorySearch(),
    LAZY_SEARCH_TIMEOUT,
  );

  return { handleSearch, loading };
}
