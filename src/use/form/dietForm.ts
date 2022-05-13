import { ref } from 'vue';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import { AppServerErrorResponse, AppDietEntity } from '@/@types';
import useAppAlert from '../globalAlert';
import { getFormErrors } from '../util/error';
import useActiveUserStore from '@/store/activeUserStore';
import useDietStore from '@/store/dietStore';
import dietApi from '@/api/diet.api';

const dietSchema = yup.object({
  $id: yup.string().optional().label('ID'),
  recipe_id: yup.string().required().label('Recipe ID'),
  date_unix: yup.number().required().label('Date of diet'),
  diet_time: yup
    .string()
    .oneOf(useDietStore().dietTimeOptions)
    .required()
    .label('Diet time'),
});

export default function handleDietForm() {
  const activeUserStore = useActiveUserStore();
  const { handleSubmit } = useForm({
    validationSchema: dietSchema,
  });

  const { triggerGlobalAlert } = useAppAlert();

  const { value: $id } = useField('$id');
  const { value: recipe_id } = useField('recipe_id');
  const { value: date_unix } = useField('date_unix');
  const { value: diet_time } = useField('diet_time');

  const validationErrors = ref<any>(null);
  const httpError = ref<AppServerErrorResponse | null>(null);
  const loading = ref<boolean>(false);

  const hasFormErrors = getFormErrors(validationErrors, httpError);

  const handleDietCreate = async (payload: AppDietEntity) => {
    httpError.value = null;
    payload.user_id = activeUserStore.account.$id;
    const [response, error] = await dietApi.createDiet(payload);
    if (error) {
      httpError.value = {
        message: error.message,
        code: error.code,
      };
    } else {
      triggerGlobalAlert({
        message: 'Diet entry created',
        variant: 'success',
      });
    }
  };

  const onValidationSuccess = async (payload: AppDietEntity | any) => {
    loading.value = true;
    validationErrors.value = null;
    await handleDietCreate(payload);
    loading.value = false;
  };

  const onValidationError = ({ errors }: any) => {
    validationErrors.value = errors;
  };

  const handleRecipeCategorySubmit = handleSubmit(
    onValidationSuccess,
    onValidationError,
  );

  return {
    $id,
    recipe_id,
    date_unix,
    diet_time,
    hasFormErrors,
    httpError,
    validationErrors,
    handleRecipeCategorySubmit,
  };
}
