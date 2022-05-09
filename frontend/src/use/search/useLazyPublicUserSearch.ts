import { Ref } from 'vue';

import publicUserStore from '../../store/publicUserStore';
import useLazySearch from '../useLazySearch';
import { APP_DEBOUNCE_TIMEOUT } from '../../constants';

const { searchPublicUsers, resetPublicUserSearch } = publicUserStore();

export default function useLazyPublicUserSearch(query: Ref<string>) {
  const { handleSearch, loading } = useLazySearch(
    () => searchPublicUsers(query.value),
    () => resetPublicUserSearch(),
    APP_DEBOUNCE_TIMEOUT,
  );

  return { handleSearch, loading };
}
