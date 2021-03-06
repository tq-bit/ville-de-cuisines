import { ref } from 'vue';
import * as yup from 'yup';
import { useForm, useField, useFieldArray } from 'vee-validate';
import { AppServerErrorResponse, Recipe } from '@/@types';
import recipesApi from '@/api/resources/recipes.api';
import useActiveUserStore from '@/store/activeUserStore';
import useAppAlert from '../globalAlert';
import { getFormErrors } from '../util/error';

const activeUserStore = useActiveUserStore();

const recipeSchema = yup.object({
  $id: yup.string().optional().label('ID'),
  original_recipe_id: yup.string().optional().label('Original recipe ID'),
  name: yup.string().required().label('Recipe name'),
  description: yup.string().optional().label('Recipe description'),
  ingredients: yup
    .array()
    .required()
    .min(2, 'Please add at least two ingredients')
    .label('Recipe ingredients'),
  portions_count: yup
    .number()
    .min(0)
    .max(500)
    .required()
    .label('Recipe portions count'),
  username: yup.string().optional().label('Recipe creator'),
  tags: yup.array().optional().label('Recipe tags'),
  category_id: yup.string().optional().label('Recipe category'),
  primary_image_id: yup
    .string()
    .optional()
    .nullable()
    .label('Recipe primary image'),
  is_public: yup.boolean().label('Recipe publicity'),
  cooking_time_minutes: yup.number().label('Recipe cooking time'),
  preparation_time_minutes: yup.number().label('Recipe preparation time'),
});

export default function handleIngredientForm() {
  const {
    handleSubmit,
    handleReset: handleRecipeReset,
    setValues: setRecipeValues,
  } = useForm({
    validationSchema: recipeSchema,
  });

  const { triggerGlobalAlert } = useAppAlert();

  const { value: $id } = useField('$id');
  const { value: original_recipe_id } = useField('original_recipe_id');
  const { value: name } = useField('name');
  const { value: description } = useField('description');
  const {
    remove: removeIngredient,
    push: pushIngredient,
    fields: recipeIngredients,
  } = useFieldArray('ingredients');
  const { value: category_id } = useField('category_id');
  const {
    remove: removeTag,
    push: pushTag,
    fields: recipeTags,
  } = useFieldArray('tags');
  const { value: portions_count } = useField('portions_count');
  const { value: primary_image_id } = useField('primary_image_id');
  const { value: isPublic } = useField('is_public');
  const { value: cooking_time_minutes } = useField('cooking_time_minutes');
  const { value: preparation_time_minutes } = useField(
    'preparation_time_minutes',
  );

  const validationErrors = ref<any>(null);
  const httpError = ref<AppServerErrorResponse | null>(null);
  const loading = ref<boolean>(false);

  const hasFormErrors = getFormErrors(validationErrors, httpError);

  const handleRecipeCreate = async (payload: Recipe) => {
    httpError.value = null;
    const [response, error] = await recipesApi.createRecipe(
      payload,
      activeUserStore.account.$id,
    );
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
    const [response, error] = await recipesApi.updateRecipe(payload);
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
    category_id,
    original_recipe_id,
    portions_count,
    pushIngredient,
    removeIngredient,
    recipeIngredients,
    cooking_time_minutes,
    preparation_time_minutes,
    pushTag,
    removeTag,
    recipeTags,
    primary_image_id,
    isPublic,
    hasFormErrors,
    httpError,
    validationErrors,
    handleRecipeSubmit,
    handleRecipeReset,
    setRecipeValues,
  };
}
