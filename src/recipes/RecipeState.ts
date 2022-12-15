import { ref } from 'vue';

import { RecipesEndpoint } from '../api/endpoints/recipe';

import { AuthenticationState } from '../auth/AuthenticationState';

import {
  ClientRecipe,
  RecipeClass,
  SearchQuery,
  SearchType,
} from '../../types';

export interface Recipe extends ClientRecipe {
  isOwnRecipe?: boolean;
  canModifyServings?: boolean;
  modifiedServings?: number;
}

export default function createRecipeState(authState: AuthenticationState) {
  const recipeService = new RecipesEndpoint();
  const { authenticatedUser } = authState;

  const recipe = ref<Recipe>(new RecipeClass());
  const recipes = ref<Recipe[]>([]);
  const searchQuery = ref<SearchQuery>({ type: 'title', text: '' });

  function isFavoriteRecipe(recipe: Recipe): boolean {
    if (!authenticatedUser.value || !authenticatedUser.value.favRecipes) {
      return false;
    }
    return authenticatedUser.value.favRecipes.includes(recipe._id!);
  }

  async function editRating(value: number) {
    recipe.value.rating = value;

    await recipeService.editRecipe(recipe.value);
  }

  function setSearch(type: SearchType, text: string) {
    searchQuery.value.type = type;
    searchQuery.value.text = text;
  }

  function resetSearch() {
    setSearch('title', '');
  }

  function getMainImageUrl(recipe: Recipe | undefined): string {
    return recipe && recipe.images && recipe.images?.length > 0
      ? recipe.images[0]
      : '';
  }

  return {
    recipe,
    recipes,
    searchQuery,

    isFavoriteRecipe,
    editRating,
    setSearch,
    resetSearch,
    getMainImageUrl,
  };
}

export type RecipeState = ReturnType<typeof createRecipeState>;
