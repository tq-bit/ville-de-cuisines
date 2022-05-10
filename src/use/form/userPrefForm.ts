import { ref } from 'vue';
import * as yup from 'yup';
import { useForm, useField, FieldContext } from 'vee-validate';
import { AppServerErrorResponse, UserTheme } from '@/@types';
import useActiveUserStore from '@/store/activeUserStore';
import { getFormErrors } from '../util/error';
import useAppAlert from '../globalAlert';

const activeUserStore = useActiveUserStore();
const { triggerGlobalAlert } = useAppAlert();

const themeOptions = ['light', 'dark'];

// Static schemata
const preferencesSchema = yup.object({
  bio: yup.string().label('Bio'),
  location: yup.string().label('Location'),
  theme: yup.string().oneOf(themeOptions).label('Theme'),
  facebook_url: yup.string().url().nullable().label('Facebook URL'),
  instagram_url: yup.string().url().nullable().label('Instagram URL'),
  pinterest_url: yup.string().url().nullable().label('Pinterest URL'),
});

// Main exported function
export default function handleUserProfileForm() {
  const loading = ref<boolean>(false);
  const validationErrors = ref<any>(null);
  const httpError = ref<AppServerErrorResponse | null>(null);

  const hasFormErrors = getFormErrors(validationErrors, httpError);

  const onValidationError = ({ errors }: any) => {
    validationErrors.value = errors;
  };

  /***********************\
	 * Pref update methods *
	\***********************/
  const { handleSubmit: handlePreferencesSubmit } = useForm({
    validationSchema: preferencesSchema,
    initialValues: {
      bio: activeUserStore.user.bio,
      location: activeUserStore.user.location,
      theme: activeUserStore.prefs.theme,
      facebook_url: activeUserStore.user.facebook_url,
      instagram_url: activeUserStore.user.instagram_url,
      pinterest_url: activeUserStore.user.pinterest_url,
    },
  });

  const { value: bio } = useField('bio') as FieldContext<string>;
  const { value: location } = useField('location') as FieldContext<string>;
  const { value: theme } = useField('theme') as FieldContext<UserTheme>;
  const { value: facebook_url } = useField(
    'facebook_url',
  ) as FieldContext<UserTheme>;
  const { value: instagram_url } = useField(
    'instagram_url',
  ) as FieldContext<UserTheme>;
  const { value: pinterest_url } = useField(
    'pinterest_url',
  ) as FieldContext<UserTheme>;

  const handleUpdatePreferences = async () => {
    httpError.value = null;
    const [prefResponse, prefError] = await activeUserStore.updatePreferences({
      theme: theme.value,
    });
    const [userResponse, userError] =
      await activeUserStore.updateActivePublicUserData({
        bio: bio.value,
        location: location.value,
        facebook_url: facebook_url.value,
        instagram_url: instagram_url.value,
        pinterest_url: pinterest_url.value,
      });
    const error = prefError || userError;
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
    facebook_url,
    instagram_url,
    pinterest_url,
    handleUpdatePreferencesSubmit,
    httpError,
    validationErrors,
    hasFormErrors,
    themeOptions,
  };
}
