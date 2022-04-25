import { AppServerErrorResponse } from '../../@types/commons';
import { ref, computed } from 'vue';
import * as yup from 'yup';
import { useForm, useField, FieldContext } from 'vee-validate';
import useIngredientsStore, { Ingredient } from '../../store/ingredientsStore';

import useAppAlert from '../globalAlert';

const ingredientSchema = yup.object({
  $id: yup.string().optional().label('ID'),
  name: yup.string().required().label('Ingredient name'),
  description: yup.string().label('Ingredient description'),
  quantity: yup.number().required().label('Quantity'),
  quantity_unit: yup
    .string()
    .oneOf(['l', 'g', 'pc', 'tsp', 'tbsp'])
    .label('Quantity unit'),
  calories: yup.number().required().label('Calories'),
  nutrients: yup.string().label('Nutrients'),
});

export default function handleIngredientForm() {
  const { createIngredient, updateIngredient } = useIngredientsStore();
  const { handleSubmit } = useForm({
    validationSchema: ingredientSchema,
  });

  const { triggerGlobalAlert } = useAppAlert();

  const { value: name } = useField('name') as FieldContext<string>;
  const { value: description } = useField(
    'description',
  ) as FieldContext<string>;
  const { value: quantity } = useField('quantity') as FieldContext<string>;
  const { value: quantity_unit } = useField(
    'quantity_unit',
  ) as FieldContext<string>;
  const { value: calories } = useField('calories') as FieldContext<string>;
  const { value: nutrients } = useField('nutrients') as FieldContext<string>;

  const validationErrors = ref<any>(null);
  const httpError = ref<AppServerErrorResponse | null>(null);
  const loading = ref<boolean>(false);

  const hasFormErrors = computed(() => {
    const hasValidationErrors =
      Object.keys(validationErrors.value || {}).length > 0;
    const hasHttpErrors = Object.keys(httpError.value || {}).length > 0;
    return hasValidationErrors || hasHttpErrors;
  });

  const handleIngredientCreate = async (payload: Ingredient) => {
    httpError.value = null;
    const [response, error] = await createIngredient(payload);
    if (error) {
      httpError.value = {
        message: error.message,
        code: error.code,
      };
    } else {
      triggerGlobalAlert({ message: 'Ingredient created', variant: 'success' });
    }
  };

  const handleIngredientUpdate = async (payload: Ingredient) => {
    httpError.value = null;
    const [response, error] = await updateIngredient(payload);
    if (error) {
      httpError.value = {
        message: error.message,
        code: error.code,
      };
    } else {
      triggerGlobalAlert({ message: 'Ingredient updated', variant: 'success' });
    }
  };

  const onValidationSuccess = async (payload: Ingredient | any) => {
    loading.value = true;
    validationErrors.value = null;
    if (payload.$id) {
      await handleIngredientUpdate(payload);
    } else {
      await handleIngredientCreate(payload);
    }
    loading.value = false;
  };

  const onValidationError = ({ errors }: any) => {
    validationErrors.value = errors;
  };

  const handleIngredientSubmit = handleSubmit(
    onValidationSuccess,
    onValidationError,
  );

  return {
    name,
    description,
    quantity,
    quantity_unit,
    calories,
    nutrients,
    hasFormErrors,
    httpError,
    validationErrors,
    handleIngredientSubmit,
  };
}
