import { ref, computed } from 'vue';

import { AlertVariant } from '../@types/commons';

export interface AlertComposableConfig {
  variant?: AlertVariant;
  message: string;
}

const variantState = ref<AlertVariant>('info');
const messageState = ref('');
const showGlobalAlertState = ref(false);
const timeoutHandler = ref<number | null>(null);

export default function useGlobalAlert() {
  const variant = computed(() => variantState.value);
  const message = computed(() => messageState.value);
  const showGlobalAlert = computed(() => showGlobalAlertState.value);

  const setAlertConfig = ({ variant, message }: AlertComposableConfig) => {
    variantState.value = variant || 'info';
    messageState.value = message;
  };

  const triggerGlobalAlert = (
    payload: AlertComposableConfig,
    timeout: number = 3500,
  ) => {
    showGlobalAlertState.value = true;
    setAlertConfig(payload);

    if (timeoutHandler.value) {
      clearTimeout(timeoutHandler.value);
    }
    timeoutHandler.value = setTimeout(() => {
      showGlobalAlertState.value = false;
    }, timeout);
  };

  return { triggerGlobalAlert, showGlobalAlert, message, variant };
}
