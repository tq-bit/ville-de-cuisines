import { computed } from '@vue/reactivity';
import { ref } from 'vue';

export default function useBusy() {
  const _localStatus = ref(false);
  const localStatus = computed(() => _localStatus.value);

  const setLocalStatus = (value: boolean) => (_localStatus.value = value);
  const toggleLocalStatus = () => (_localStatus.value = !_localStatus.value);

  return { localStatus, setLocalStatus, toggleLocalStatus };
}
