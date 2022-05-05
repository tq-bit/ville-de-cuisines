import {
  AppServerErrorResponse,
  Recipe,
  RecipeCategory,
} from '../../@types/commons';
import { ref } from 'vue';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import useRecipeStore from '../../store/recipeStore';
import useAppAlert from '../globalAlert';
import { getFormErrors } from '../util/error';

const { createRecipeCategory, updateRecipeCategory } = useRecipeStore();

const recipeCategorySchema = yup.object({
  $id: yup.string().optional().label('ID'),
  name: yup.string().required().label('Recipe category name'),
  primary_image_id: yup
    .string()
    .optional()
    .nullable()
    .label('Recipe category primary image'),
});

export default function handleRecipeCategoryForm() {
  const {
    handleSubmit,
    handleReset: handleRecipeCategoryReset,
    setValues: setRecipeCategoryValues,
  } = useForm({
    validationSchema: recipeCategorySchema,
  });

  const { triggerGlobalAlert } = useAppAlert();

  const { value: $id } = useField('$id');
  const { value: primary_image_id } = useField('primary_image_id');
  const { value: name } = useField('name');

  const validationErrors = ref<any>(null);
  const httpError = ref<AppServerErrorResponse | null>(null);
  const loading = ref<boolean>(false);

  const hasFormErrors = getFormErrors(validationErrors, httpError);

  const handleRecipeCategoryCreate = async (payload: RecipeCategory) => {
    httpError.value = null;
    const [response, error] = await createRecipeCategory(payload);
    if (error) {
      httpError.value = {
        message: error.message,
        code: error.code,
      };
    } else {
      triggerGlobalAlert({
        message: 'Recipe category created',
        variant: 'success',
      });
    }
  };

  const handleRecipeCategoryUpdate = async (payload: RecipeCategory) => {
    httpError.value = null;
    const [response, error] = await updateRecipeCategory(payload);
    if (error) {
      httpError.value = {
        message: error.message,
        code: error.code,
      };
    } else {
      triggerGlobalAlert({ message: 'Recipe updated', variant: 'success' });
    }
  };

  const onValidationSuccess = async (payload: Recipe | any) => {
    loading.value = true;
    validationErrors.value = null;
    if (payload.$id) {
      await handleRecipeCategoryUpdate(payload);
    } else {
      await handleRecipeCategoryCreate(payload);
    }
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
    name,
    primary_image_id,
    hasFormErrors,
    httpError,
    validationErrors,
    handleRecipeCategorySubmit,
    handleRecipeCategoryReset,
    setRecipeCategoryValues,
  };
}
