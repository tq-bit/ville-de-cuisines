import { BooleanMap } from '@/@types';
import { ref, computed } from 'vue';

export default function useBusy(key: string) {
  const _localStatus = ref<BooleanMap>({ [key]: false });
  const localStatus = computed(() => {
    return _localStatus.value[key];
  });

  const setLocalStatus = (value: boolean) => {
    if (!key) {
      console.warn('useBusy: key is not defined');
    } else {
      _localStatus.value[key] = value;
    }
  };
  const toggleLocalStatus = () => {
    if (!key) {
      console.warn('useBusy: key is not defined');
    } else {
      _localStatus.value[key] = !_localStatus.value[key];
    }
  };

  return { _id: key, localStatus, setLocalStatus, toggleLocalStatus };
}
