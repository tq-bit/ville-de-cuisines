import { AppServerErrorResponse, Recipe } from '../../@types/commons';
import { ref } from 'vue';
import * as yup from 'yup';
import { useForm, useField, useFieldArray } from 'vee-validate';
import recipeStore from '../../store/recipeStore';
import useAppAlert from '../globalAlert';
import { getFormErrors } from '../util/error';

const { createRecipe, updateRecipe } = recipeStore();
console.log(recipeStore());

const recipeSchema = yup.object({
  $id: yup.string().optional().label('ID'),
  original_recipe_id: yup.string().optional().label('Original recipe ID'),
  name: yup.string().required().label('Recipe name'),
  description: yup.string().optional().label('Recipe description'),
  ingredients: yup.array().label('Recipe ingredients'),
  username: yup.string().optional().label('Recipe creator'),
  tags: yup.array().optional().label('Recipe tags'),
  primary_image: yup.string().optional().label('Recipe primary image'),
  is_public: yup.boolean().optional().label('Recipe publicity'),
});

export default function handleIngredientForm() {
  const { handleSubmit } = useForm({
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
  const {
    remove: removeTag,
    push: pushTag,
    fields: recipeTags,
  } = useFieldArray('tags');
  const { value: primary_image } = useField('primary_image');
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
    original_recipe_id,
    pushIngredient,
    removeIngredient,
    recipeIngredients,
    pushTag,
    removeTag,
    recipeTags,
    primary_image,
    isPublic,
    hasFormErrors,
    httpError,
    validationErrors,
    handleRecipeSubmit,
  };
}
