import { computed, Ref } from 'vue';
import { AppServerErrorResponse } from '../../@types/commons';

export function getFormErrors(
  validationErrors: Ref<any>,
  httpError: Ref<AppServerErrorResponse | null>,
) {
  return computed(() => {
    const hasValidationErrors =
      Object.keys(validationErrors.value || {}).length > 0;
    const hasHttpErrors = Object.keys(httpError.value || {}).length > 0;
    return hasValidationErrors || hasHttpErrors;
  });
}
