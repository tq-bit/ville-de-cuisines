<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AppGalleryItemType, Ingredient } from '../../@types';
import useRecipeStore from '../../store/recipeStore';
import { useRouter } from 'vue-router';
import ingredientsApi from '../../api/ingredients.api';

const recipeStore = useRecipeStore();

const router = useRouter();
const onClickGalleryItem = (recipe: AppGalleryItemType) => {
  router.push({ path: `/recipe/${recipe.$id}` });
};

const suggestionCount = ref<number>(6);
const localIngredient = ref<Ingredient>();
const localRecipesByIngredient = ref<AppGalleryItemType[]>([]);

const setLocalIngredient = async (categoryId: string) => {
  const [response, error] = await ingredientsApi.fetchIngredientById(
    categoryId,
  );
  localIngredient.value = response as Ingredient;
};
const setLocalRecipeSuggestions = async (count: number) => {
  if (router.currentRoute.value.params.ingredientId) {
    await recipeStore.syncRecipesByIngredient(
      router.currentRoute.value.params.ingredientId as string,
      count,
    );
    localRecipesByIngredient.value =
      recipeStore.publicRecipesByIngredientForGallery(
        router.currentRoute.value.params.ingredientId as string,
      );
  }
};

onMounted(async () => {
  await setLocalIngredient(
    router.currentRoute.value.params.ingredientId as string,
  );
  await setLocalRecipeSuggestions(suggestionCount.value);
});
</script>

<template>
  <div class="mt-4">
    <app-grid variant="sidebar-left">
      <template v-slot:left>
        <app-card block>
          <app-image
            class="mb-4"
            size="xsmall"
            :rounded="true"
            :src="(localIngredient?.primary_image_href as string)"
          ></app-image>

          <h1 class="text-xl">{{ localIngredient?.name }}</h1>

          <h2 class="text-base font-semibold">
            {{ localIngredient?.quantity }}
            {{ localIngredient?.quantity_unit }} of
            {{ localIngredient?.name }} add:
          </h2>

          <ul>
            <li v-if="localIngredient?.fat">Fat: {{ localIngredient.fat }}g</li>
            <li v-if="localIngredient?.saturated_fat">
              Saturated fat: {{ localIngredient.saturated_fat }}g
              <span
                v-if="localIngredient?.fat && localIngredient?.saturated_fat"
                >({{
                  (
                    (localIngredient?.saturated_fat / localIngredient?.fat) *
                    100
                  ).toFixed(2)
                }}
                %)</span
              >
            </li>
            <hr class="my-2" />
            <li v-if="localIngredient?.carbohydrate">
              Carbohydrate: {{ localIngredient.carbohydrate }}g
            </li>
            <li v-if="localIngredient?.sugar">
              Sugar: {{ localIngredient.sugar }}g
              <span
                v-if="localIngredient?.sugar && localIngredient?.carbohydrate"
                >({{
                  (
                    (localIngredient?.sugar / localIngredient?.carbohydrate) *
                    100
                  ).toFixed(2)
                }}
                %)</span
              >
            </li>
            <hr class="my-2" />
            <li v-if="localIngredient?.protein">
              Protein: {{ localIngredient.protein }}g
            </li>
            <li v-if="localIngredient?.salt">
              Salt: {{ localIngredient.salt }}g
            </li>
          </ul>
          <hr class="mt-2 mb-6" />

          <form @submit.prevent="setLocalRecipeSuggestions(suggestionCount)">
            <app-input
              v-model="suggestionCount"
              label="Recipe suggestion count"
            ></app-input>
            <app-button block type="submit">Refresh suggestions</app-button>
          </form>
        </app-card>
      </template>

      <template v-slot:default>
        <h1>Recipes where "{{ localIngredient?.name }}" is used:</h1>
        <app-gallery
          variant="recipe"
          :items="localRecipesByIngredient"
          :cols="2"
          @click="onClickGalleryItem"
        ></app-gallery>
      </template>
    </app-grid>
  </div>
</template>

<style scoped></style>
