import { ref } from 'vue';
import * as yup from 'yup';
import { useForm, useField, FieldContext } from 'vee-validate';
import { AppServerErrorResponse, Ingredient } from '@/@types';
import IngredientsApi from '@/api/resources/ingredients.api';
import useIngredientsStore from '@/store/ingredientsStore';
import useAppAlert from '../globalAlert';
import { getFormErrors } from '../util/error';
import useLogger from '../util/logger';

const { log } = useLogger();
const ingredientApi = new IngredientsApi();

const { quantityOptionKeys } = useIngredientsStore();

const ingredientSchema = yup.object({
  $id: yup.string().optional().label('ID'),
  name: yup.string().required().label('Ingredient name'),
  description: yup.string().label('Ingredient description'),
  quantity: yup.number().required().label('Quantity'),
  quantity_unit: yup.string().oneOf(quantityOptionKeys).label('Quantity unit'),
  calories: yup.number().required().label('Calories'),
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

  const validationErrors = ref<any>(null);
  const httpError = ref<AppServerErrorResponse | null>(null);
  const loading = ref<boolean>(false);

  const hasFormErrors = getFormErrors(validationErrors, httpError);

  const handleIngredientCreate = async (payload: Ingredient) => {
    httpError.value = null;
    const [response, error] = await ingredientApi.createIngredient(payload);
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
    primary_image_id,
    hasFormErrors,
    httpError,
    validationErrors,
    handleIngredientSubmit,
  };
}
