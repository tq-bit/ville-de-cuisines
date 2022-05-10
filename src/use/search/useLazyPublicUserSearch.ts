import { Ref } from 'vue';

import publicUserStore from '../../store/publicUserStore';
import useLazySearch from '../useLazySearch';
import { APP_DEBOUNCE_TIMEOUT } from '../../constants';

export default function useLazyPublicUserSearch(query: Ref<string>) {
  const { searchPublicUsers, resetPublicUserSearch } = publicUserStore();
  const { handleSearch, loading } = useLazySearch(
    () => searchPublicUsers(query.value),
    () => resetPublicUserSearch(),
    APP_DEBOUNCE_TIMEOUT,
  );

  return { handleSearch, loading };
}
