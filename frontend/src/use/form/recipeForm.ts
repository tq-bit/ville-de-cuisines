import { AppServerErrorResponse, Recipe } from '../../@types/commons';
import { ref } from 'vue';
import * as yup from 'yup';
import { useForm, useField, useFieldArray } from 'vee-validate';
import useRecipeStore from '../../store/recipeStore';
import useAppAlert from '../globalAlert';
import { getFormErrors } from '../util/error';

const { createRecipe, updateRecipe } = useRecipeStore();

const recipeSchema = yup.object({
  $id: yup.string().optional().label('ID'),
  originalRecipeId: yup.string().optional().label('Original recipe ID'),
  name: yup.string().required().label('Recipe name'),
  description: yup.string().optional().label('Recipe description'),
  ingredients: yup.array().label('Recipe ingredients'),
  username: yup.string().optional().label('Recipe creator'),
  tags: yup.array().optional().label('Recipe tags'),
  public: yup.boolean().optional().label('Recipe publicity'),
});

export default function handleIngredientForm() {
  const { handleSubmit } = useForm({
    validationSchema: recipeSchema,
  });

  const { triggerGlobalAlert } = useAppAlert();

  const { value: $id } = useField('$id');
  const { value: originalRecipeId } = useField('original_recipe_id');
  const { value: name } = useField('name');
  const { value: description } = useField('description');
  const {
    remove: removeIngredient,
    push: pushIngredient,
    fields: recipeIngredients,
  } = useFieldArray('ingredients');
  const {
    remove: removeTag,
    push: pushTag,
    fields: recipeTags,
  } = useFieldArray('tags');
  const { value: isPublic } = useField('is_public');

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
    console.log(payload);
    // if (payload.$id) {
    //   await handleRecipeUpdate(payload);
    // } else {
    //   await handleRecipeCreate(payload);
    // }
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
    pushIngredient,
    removeIngredient,
    recipeIngredients,
    pushTag,
    removeTag,
    recipeTags,
    isPublic,
    hasFormErrors,
    httpError,
    validationErrors,
    handleRecipeSubmit,
  };
}