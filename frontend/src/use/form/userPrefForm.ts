import { AppServerErrorResponse, UserTheme } from '../../@types/commons';

import { ref, computed } from 'vue';
import * as yup from 'yup';
import { useForm, useField, FieldContext } from 'vee-validate';
import useActiveUserStore from '../../store/activeUserStore';
import useAppAlert from '../globalAlert';

const activeUserStore = useActiveUserStore();
const { triggerGlobalAlert } = useAppAlert();

const themeOptions = ['light', 'dark'];

// Static schemata
const preferencesSchema = yup.object({
  bio: yup.string().label('Bio'),
  location: yup.string().label('Location'),
  theme: yup.string().oneOf(themeOptions).label('Theme'),
});

// Main exported function
export default function handleUserProfileForm() {
  let loading = ref<boolean>(false);
  let validationErrors = ref<any>(null);
  let httpError = ref<AppServerErrorResponse | null>(null);
  const hasFormErrors = computed(() => {
    const hasValidationErrors =
      Object.keys(validationErrors.value || {}).length > 0;
    const hasHttpErrors = Object.keys(httpError.value || {}).length > 0;
    return hasValidationErrors || hasHttpErrors;
  });

  const onValidationError = ({ errors }: any) => {
    validationErrors.value = errors;
  };

  /***********************\
	 * Pref update methods *
	\***********************/
  const { handleSubmit: handlePreferencesSubmit } = useForm({
    validationSchema: preferencesSchema,
    initialValues: {
      bio: activeUserStore.prefs.bio,
      location: activeUserStore.prefs.location,
      theme: activeUserStore.prefs.theme,
    },
  });

  const { value: bio } = useField('bio') as FieldContext<string>;
  const { value: location } = useField('location') as FieldContext<string>;
  const { value: theme } = useField('theme') as FieldContext<UserTheme>;

  const handleUpdatePreferences = async () => {
    httpError.value = null;
    const [response, error] = await activeUserStore.updatePreferences({
      bio: bio.value,
      location: location.value,
      theme: theme.value,
    });
    if (error) {
      setHttpError({ message: error.message, code: error.code });
    } else {
      triggerGlobalAlert({
        message: 'Preferences updated',
        variant: 'success',
      });
    }
  };

  const onPreferencesValidationSuccess = async () => {
    setLoading(true);
    validationErrors.value = null;
    await handleUpdatePreferences();
    setLoading(false);
  };

  const handleUpdatePreferencesSubmit = handlePreferencesSubmit(
    onPreferencesValidationSuccess,
    onValidationError,
  );

  // Util setter methods
  const setHttpError = (payload: any) => {
    httpError.value = payload;
  };

  const setLoading = (payload: boolean) => {
    loading.value = payload;
  };

  return {
    bio,
    location,
    theme,
    handleUpdatePreferencesSubmit,
    httpError,
    hasFormErrors,
    themeOptions,
  };
}
