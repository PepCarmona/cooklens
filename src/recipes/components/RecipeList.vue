<template>
  <div class="card-container" :class="{ embedded, thin, 'pb-3': !embedded }">
    <div class="grid">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe._id"
        :recipe="recipe"
        :embedded="embedded"
        :showActions="showActions"
        @see-more-info="$emit('see-more-info', $event)"
        @select-recipe="$emit('select-recipe', $event)"
      />
    </div>
    <div v-if="isLoadingRecipes" class="loadingCard">
      <LoadingSpinner />
    </div>
    <template v-else>
      <div v-if="recipes.length === 0">No recipes match this search</div>
      <Pagination
        v-if="!(currentPage === 1 && !hasNextPage) && !isLoadingRecipes"
        class="mt-2"
        :hasNextPage="hasNextPage"
        @load-more="$emit('load-more')"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { inject, PropType } from 'vue';
import RecipeCard from '../../recipes/components/RecipeCard.vue';
import Pagination from '../../shared/Pagination/Pagination.vue';
import LoadingSpinner from '../../shared/LoadingSpinner.vue';
import { ClientRecipe } from '../../../types';
import { LoadingStateKey, PaginationStatekey } from '../../injectionKeys';

defineProps({
  recipes: {
    type: Array as PropType<ClientRecipe[]>,
    required: true,
  },
  thin: Boolean,
  embedded: Boolean,
  showActions: Boolean,
});
defineEmits(['load-more', 'select-recipe', 'see-more-info']);

const paginationState = inject(PaginationStatekey)!;
const { currentPage, hasNextPage } = paginationState;

const loadingState = inject(LoadingStateKey)!;
const { isLoadingRecipes } = loadingState;
</script>

<style lang="scss" scoped>
.seeAll {
  background-color: var(--accent-color-complementary);
  color: var(--inverted-text-color);
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  padding-left: 0.6rem;
  padding-right: 0.6rem;
  border-radius: 50px;
  width: fit-content;
  margin: auto;
  cursor: pointer;
}

.card-container {
  padding: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  &.embedded {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    width: fit-content;
    flex-wrap: nowrap;
    padding: 0;
  }
}

.grid {
  display: grid;
  grid-gap: 60px;
  justify-content: center;
  justify-items: center;
  align-items: center;
}

.loadingCard {
  width: 100%;
  margin-top: 2rem;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media only screen and (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media only screen and (min-width: 1400px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
