import { AppServerErrorResponse, Recipe } from '../../@types/commons';
import { ref } from 'vue';
import * as yup from 'yup';
import { useForm, useField, FieldContext } from 'vee-validate';
import useRecipeStore from '../../store/recipeStore';
import useAppAlert from '../globalAlert';
import { getFormErrors } from '../util/error';

const { createRecipe, updateRecipe } = useRecipeStore();

const recipeSchema = yup.object({
  $id: yup.string().optional().label('ID'),
  originalRecipeId: yup.string().required().label('Original recipe ID'),
  name: yup.string().required().label('Recipe name'),
  description: yup.string().optional().label('Recipe description'),
  ingredients: yup.array().label('Recipe ingredients'),
  username: yup.string().required().label('Recipe creator'),
  tags: yup.string().optional().label('Recipe tags'),
  public: yup.boolean().optional().label('Recipe publicity'),
});

export default function handleIngredientForm() {
  const { handleSubmit } = useForm({
    validationSchema: recipeSchema,
  });

  const { triggerGlobalAlert } = useAppAlert();

  const { value: $id } = useField('$id') as FieldContext<string>;
  const { value: originalRecipeId } = useField(
    'original_recipe_id',
  ) as FieldContext<string>;
  const { value: name } = useField('name') as FieldContext<string>;
  const { value: description } = useField(
    'description',
  ) as FieldContext<string>;
  const { value: ingredientId } = useField(
    'ingredient_id',
  ) as FieldContext<number>;
  const { value: ingredientQuantity } = useField(
    'ingredient_quantity',
  ) as FieldContext<number>;
  const { value: tags } = useField('tags') as FieldContext<number>;
  const { value: isPublic } = useField('is_public') as FieldContext<number>;

  const validationErrors = ref<any>(null);
  const httpError = ref<AppServerErrorResponse | null>(null);
  const loading = ref<boolean>(false);

  const hasFormErrors = getFormErrors(validationErrors, httpError);

  const handleRecipeCreate = async (payload: Recipe) => {
    httpError.value = null;
    const [response, error] = await createRecipe(payload);
    if (error) {
      httpError.value = {
        message: error.message,
        code: error.code,
      };
    } else {
      triggerGlobalAlert({ message: 'Recipe created', variant: 'success' });
    }
  };

  const handleRecipeUpdate = async (payload: Recipe) => {
    httpError.value = null;
    const [response, error] = await updateRecipe(payload);
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
      await handleRecipeUpdate(payload);
    } else {
      await handleRecipeCreate(payload);
    }
    loading.value = false;
  };

  const onValidationError = ({ errors }: any) => {
    validationErrors.value = errors;
  };

  const handleRecipeSubmit = handleSubmit(
    onValidationSuccess,
    onValidationError,
  );

  return {
    $id,
    name,
    description,
    originalRecipeId,
    ingredientId,
    ingredientQuantity,
    tags,
    isPublic,
    hasFormErrors,
    httpError,
    validationErrors,
    handleRecipeSubmit,
  };
}
