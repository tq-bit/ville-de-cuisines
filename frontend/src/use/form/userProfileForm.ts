import { AppServerErrorResponse } from '../../@types/commons';

import { ref, computed, toRefs } from 'vue';
import * as yup from 'yup';
import { useForm, useField, FieldContext } from 'vee-validate';
import useActiveUserStore from '../../store/activeUserStore';
import useAppAlert from '../globalAlert';

const activeUserStore = useActiveUserStore();
const { triggerGlobalAlert } = useAppAlert();

// Static schemata
const usernameSchema = yup.object({
  username: yup.string().label('Username'),
});

const emailSchema = yup.object({
  email: yup.string().required().email().label('Email address'),
  password: yup.string().required().min(8).label('Password'),
});

const passwordSchema = yup.object({
  oldPassword: yup.string().required().min(8).label('Old Password'),
  newPassword: yup.string().required().min(8).label('New password'),
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

  /************************\
	 * Email update methods *
	\************************/
  const { handleSubmit: handleEmailSubmit } = useForm({
    validationSchema: emailSchema,
    initialValues: {
      email: activeUserStore.user.email,
      password: '',
    },
  });

  const { value: email } = useField('email') as FieldContext<string>;
  const { value: password } = useField('password') as FieldContext<string>;

  const handleUpdateEmail = async () => {
    httpError.value = null;
    const [response, error] = await activeUserStore.updateEmail({
      email: email.value,
      password: password.value,
    });
    if (error) {
      setHttpError({ message: error.message, code: error.code });
    } else {
      triggerGlobalAlert({
        message: 'Email address updated',
        variant: 'success',
      });
    }
  };

  const onEmailValidationSuccess = async () => {
    setLoading(true);
    validationErrors.value = null;
    await handleUpdateEmail();
    setLoading(false);
  };

  const handleUpdateEmailSubmit = handleEmailSubmit(
    onEmailValidationSuccess,
    onValidationError,
  );

  /***************************\
	 * Username update methods *
	\***************************/
  const { handleSubmit: handleUsernameSubmit } = useForm({
    validationSchema: usernameSchema,
    initialValues: {
      username: activeUserStore.user.name,
    },
  });

  const { value: username } = useField('username') as FieldContext<string>;

  const handleUpdateUsername = async () => {
    httpError.value = null;
    const [response, error] = await activeUserStore.updateUsername({
      username: username.value,
    });
    if (error) {
      setHttpError({ message: error.message, code: error.code });
    } else {
      triggerGlobalAlert({ message: 'Username updated', variant: 'success' });
    }
  };

  const onUsernameValidationSuccess = async () => {
    setLoading(true);
    validationErrors.value = null;
    await handleUpdateUsername();
    setLoading(false);
  };

  const handleUpdateUsernameSubmit = handleUsernameSubmit(
    onUsernameValidationSuccess,
    onValidationError,
  );

  /**************************\
	 * Password update methods*
	\**************************/
  const { handleSubmit: handlePasswordSubmit } = useForm({
    validationSchema: passwordSchema,
  });

  const { value: oldPassword } = useField(
    'oldPassword',
  ) as FieldContext<string>;
  const { value: newPassword } = useField(
    'newPassword',
  ) as FieldContext<string>;

  const handleUpdatePassword = async () => {
    httpError.value = null;
    const [response, error] = await activeUserStore.updatePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });
    if (error) {
      setHttpError({ message: error.message, code: error.code });
    } else {
      triggerGlobalAlert({ message: 'Password updated', variant: 'success' });
    }
  };

  const onPasswordValidationSuccess = async () => {
    setLoading(true);
    validationErrors.value = null;
    await handleUpdatePassword();
    setLoading(false);
  };

  const handleUpdatePasswordSubmit = handlePasswordSubmit(
    onPasswordValidationSuccess,
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
    loading,
    username,
    email,
    password,
    oldPassword,
    newPassword,
    handleUpdateEmailSubmit,
    handleUpdateUsernameSubmit,
    handleUpdatePasswordSubmit,
    validationErrors,
    hasFormErrors,
    httpError,
  };
}
