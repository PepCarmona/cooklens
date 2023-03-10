<template>
  <div :class="{ embedded }">
    <div class="search">
      <SearchRecipe
        @search="doSearch()"
        @back="$emit('back')"
        :embedded="embedded"
      />
    </div>
    <Button
      v-if="showCreateRecipe"
      class="create-recipe"
      @click="$emit('create-recipe')"
    >
      <span>Create new recipe</span>
      <i class="las la-arrow-right"></i>
    </Button>
    <RecipeList
      :recipes="recipes"
      @load-more="loadMoreRecipes"
      :embedded="embedded"
      :showActions="showActions"
      @see-more-info="$emit('see-more-info', $event)"
      @select-recipe="$emit('select-recipe', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchRecipe from '../../recipes/components/SearchRecipe.vue';
import RecipeList from '../../recipes/components/RecipeList.vue';
import { SearchType } from '../../../types';
import {
  PaginationStatekey,
  RecipeServiceKey,
  RecipeStateKey,
} from '../../injectionKeys';

const props = defineProps({
  embedded: Boolean,
  showActions: Boolean,
  showCreateRecipe: Boolean,
});
defineEmits(['back', 'select-recipe', 'see-more-info', 'create-recipe']);

const recipeState = inject(RecipeStateKey)!;
const { recipes, setSearch, resetSearch, searchQuery } = recipeState;

const paginationState = inject(PaginationStatekey)!;
const { currentPage } = paginationState;

const recipeService = inject(RecipeServiceKey)!;
const { loadMoreRecipes } = recipeService;

const router = useRouter();
const route = useRoute();

// const cachedRecipes = ref<Recipe[]>([]);

onMounted(() => {
  if (props.embedded) {
    resetSearch();
    return;
  }

  if (route.query.searchBy && route.query.searchText) {
    setSearch(
      route.query.searchBy.toString() as SearchType,
      route.query.searchText.toString()
    );
  }

  currentPage.value = parseInt(route.query.page?.toString() ?? '1');
  doSearch();
});

function updateQueryString() {
  if (props.embedded) {
    return;
  }

  router.push({
    name: 'RecipesMainView',
    query: {
      ...route.query,
      searchBy:
        searchQuery && searchQuery.value.text !== ''
          ? searchQuery.value.type
          : undefined,
      searchText:
        searchQuery && searchQuery.value.text !== ''
          ? searchQuery.value.text
          : undefined,
      page: currentPage.value > 1 ? currentPage.value : undefined,
    },
  });
}

function doSearch() {
  updateQueryString();

  recipeService.searchRecipes(currentPage.value);
}
</script>

<style lang="scss" scoped>
.embedded {
  display: flex;
  flex-direction: column;
  height: 100%;
  & > .search {
    margin-bottom: 1.5rem;
  }
}

div:not(.embedded) > .search {
  padding: 1rem;
  padding-top: calc(2rem + 50px);
  margin-top: -50px;
}

.create-recipe {
  position: relative;
  background-color: var(--grey-800);
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  border-radius: 0.5rem;
  justify-content: space-between;
  &:hover {
    background-color: var(--grey-700);
  }
  & > * {
    color: var(--inverted-text-color);
  }
}

@media only screen and (min-width: 769px) {
  .search {
    padding-top: calc(2rem + 60px);
    margin-top: -60px;
  }
}
</style>
