import { ref } from 'vue';

export default function useLazySearch(
  handler: (query: string) => Promise<void>,
  resetHandler: () => void,
  timeout: number,
) {
  const timeoutHandler = ref<number>(0);
  const loading = ref<boolean>(false);

  const handleSearch = (query: string) => {
    if (timeoutHandler.value) {
      clearTimeout(timeoutHandler.value);
    }

    if (!!query && query !== '') {
      loading.value = true;
      timeoutHandler.value = setTimeout(() => {
        handler(query).finally(() => {
          loading.value = false;
        });
      }, timeout || 1000);
    } else {
      loading.value = false;
      resetHandler();
    }
  };

  return { loading, handleSearch };
}
