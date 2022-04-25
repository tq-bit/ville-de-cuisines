import {
  AppUserAuthForm,
  AppUserLoginPayload,
  AppServerErrorResponse,
} from '../../@types/commons';
import { ref, computed } from 'vue';
import * as yup from 'yup';
import { useForm, useField, FieldContext } from 'vee-validate';
import useSessionStore from '../../store/sessionStore';
import useAppAlert from '../globalAlert';
import { getFormErrors } from '../../util/error.util';

const formValidationSchema = yup.object({
  email: yup.string().required().email().label('Email address'),
  username: yup.string().label('Username'),
  password: yup.string().required().min(8).label('Password'),
});

export default function handleUserAuthForm(type: AppUserAuthForm) {
  const { login, signup } = useSessionStore();
  const { handleSubmit } = useForm({
    validationSchema: formValidationSchema,
  });
  const { triggerGlobalAlert } = useAppAlert();

  const { value: email } = useField('email') as FieldContext<string>;
  const { value: username } = useField('username') as FieldContext<string>;
  const { value: password } = useField('password') as FieldContext<string>;

  const validationErrors = ref<any>(null);
  const httpError = ref<AppServerErrorResponse | null>(null);
  const loading = ref<boolean>(false);

  const hasFormErrors = getFormErrors(validationErrors, httpError);

  const handleUserLogin = async ({ email, password }: AppUserLoginPayload) => {
    httpError.value = null;
    const [response, error] = await login({ email, password });
    if (error) {
      httpError.value = {
        message: error.message,
        code: error.code,
      };
    } else {
      triggerGlobalAlert({ message: 'Login successful', variant: 'success' });
    }
  };

  const handleUserSignup = async ({
    email,
    username,
    password,
  }: AppUserLoginPayload) => {
    httpError.value = null;
    const [signupResponse, signupError] = await signup({
      email,
      username,
      password,
    });

    if (signupError) {
      httpError.value = {
        message: signupError?.message,
        code: signupError?.code,
      };
    } else {
      await login({ email, password });
      triggerGlobalAlert({ message: 'Signup successful', variant: 'success' });
    }
  };

  const onValidationSuccess = async ({
    email,
    username,
    password,
  }: AppUserLoginPayload | any) => {
    loading.value = true;
    validationErrors.value = null;
    if (type === 'login') {
      await handleUserLogin({ email, password });
    }
    if (type === 'signup') {
      await handleUserSignup({ email, username, password });
    }
    loading.value = false;
  };

  const onValidationError = ({ errors }: any) => {
    validationErrors.value = errors;
  };

  const handleUserSubmit = handleSubmit(onValidationSuccess, onValidationError);

  return {
    loading,
    email,
    username,
    password,
    handleUserSubmit,
    validationErrors,
    hasFormErrors,
    httpError,
  };
}
