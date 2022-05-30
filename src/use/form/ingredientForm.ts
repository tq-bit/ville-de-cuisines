import { ref } from 'vue';
import * as yup from 'yup';
import { useForm, useField, FieldContext } from 'vee-validate';
import { AppServerErrorResponse, Ingredient } from '@/@types';
import ingredientsApi from '@/api/ingredients.api';
import useIngredientsStore from '@/store/ingredientsStore';
import useAppAlert from '../globalAlert';
import { getFormErrors } from '../util/error';
import useLogger from '../util/logger';

const { log } = useLogger();

const { quantityOptionKeys } = useIngredientsStore();

const ingredientSchema = yup.object({
  $id: yup.string().optional().label('ID'),
  name: yup.string().required().label('Ingredient name'),
  description: yup.string().label('Ingredient description'),
  quantity: yup.number().required().label('Quantity'),
  quantity_unit: yup.string().oneOf(quantityOptionKeys).label('Quantity unit'),
  calories: yup.number().required().label('Calories'),
  fat: yup.number().optional().nullable().label('Fat'),
  saturated_fat: yup.number().optional().nullable().label('Saturated fat'),
  carbohydrate: yup.number().optional().nullable().label('Carbohydrate'),
  sugar: yup.number().optional().nullable().label('Sugar'),
  fiber: yup.number().optional().nullable().label('Fiber'),
  protein: yup.number().optional().nullable().label('Protein'),
  salt: yup.number().optional().nullable().label('Salt'),
  primary_image_id: yup
    .string()
    .optional()
    .nullable()
    .label('Primary image ID'),
});

export default function handleIngredientForm() {
  const { handleSubmit } = useForm({
    validationSchema: ingredientSchema,
  });

  const { triggerGlobalAlert } = useAppAlert();

  const { value: $id } = useField('$id') as FieldContext<string>;
  const { value: name } = useField('name') as FieldContext<string>;
  const { value: description } = useField(
    'description',
  ) as FieldContext<string>;
  const { value: quantity } = useField('quantity') as FieldContext<number>;
  const { value: primary_image_id } = useField(
    'primary_image_id',
  ) as FieldContext<string>;
  const { value: quantity_unit } = useField(
    'quantity_unit',
  ) as FieldContext<string>;
  const { value: calories } = useField('calories') as FieldContext<number>;
  const { value: fat } = useField('fat') as FieldContext<number>;
  const { value: saturated_fat } = useField(
    'saturated_fat',
  ) as FieldContext<number>;
  const { value: carbohydrate } = useField(
    'carbohydrate',
  ) as FieldContext<number>;
  const { value: sugar } = useField('sugar') as FieldContext<number>;
  const { value: fiber } = useField('fiber') as FieldContext<number>;
  const { value: protein } = useField('protein') as FieldContext<number>;
  const { value: salt } = useField('salt') as FieldContext<number>;

  const validationErrors = ref<any>(null);
  const httpError = ref<AppServerErrorResponse | null>(null);
  const loading = ref<boolean>(false);

  const hasFormErrors = getFormErrors(validationErrors, httpError);

  const handleIngredientCreate = async (payload: Ingredient) => {
    httpError.value = null;
    const [response, error] = await ingredientsApi.createIngredient(payload);
    if (error) {
      httpError.value = {
        message: error.message,
        code: error.code,
      };
    } else {
      triggerGlobalAlert({ message: 'Ingredient created', variant: 'success' });
    }
  };

  const onValidationSuccess = async (payload: Ingredient | any) => {
    loading.value = true;
    validationErrors.value = null;
    if (payload.$id) {
      log('ERROR: Ingredient update not implemented', 'error');
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
    $id,
    name,
    description,
    quantity,
    quantity_unit,
    calories,
    fat,
    saturated_fat,
    carbohydrate,
    sugar,
    fiber,
    protein,
    salt,
    primary_image_id,
    hasFormErrors,
    httpError,
    validationErrors,
    handleIngredientSubmit,
  };
}
