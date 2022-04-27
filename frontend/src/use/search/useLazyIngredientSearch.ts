import { Ref } from 'vue';

import ingredientsStore from '../../store/ingredientsStore';
import useLazySearch from '../useLazySearch';
import { LAZY_SEARCH_TIMEOUT } from '../../constants';

const { searchIngredients, resetIngredientSearch } = ingredientsStore();

export default function useLazyIngredientSearch(query: Ref<string>) {
  const { handleSearch, loading } = useLazySearch(
    () => searchIngredients(query.value),
    () => resetIngredientSearch(),
    LAZY_SEARCH_TIMEOUT,
  );

  return { handleSearch, loading };
}
