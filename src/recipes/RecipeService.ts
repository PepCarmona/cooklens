import { RecipesEndpoint } from '../api/endpoints/recipe';
import { AuthenticationState } from '../auth/AuthenticationState';
import { loadingState } from '../LoadingState';
import { PaginationState } from '../shared/Pagination/PaginationState';
import { ClientRecipe, UserInfo } from '../../types';
import { Recipe, RecipeState } from './RecipeState';

const recipesEndpoint = new RecipesEndpoint();

export default function createRecipeService(
  recipeState: RecipeState,
  authState: AuthenticationState,
  paginationState: PaginationState
) {
  const { isLoadingRecipes } = loadingState;
  const { currentPage, nextPage } = paginationState;

  function addRecipe(recipe: Recipe): Promise<Recipe> {
    isLoadingRecipes.value = true;

    recipe.authorId = authState.authenticatedUser.value?._id;

    return recipesEndpoint
      .addRecipe(recipe)
      .then(computeRecipe)
      .finally(() => (isLoadingRecipes.value = false));
  }

  function editRecipe(_recipe: Recipe): Promise<Recipe> {
    isLoadingRecipes.value = true;

    return recipesEndpoint
      .editRecipe(_recipe)
      .then(
        (editedRecipe) =>
          (recipeState.recipe.value = computeRecipe(editedRecipe))
      )
      .finally(() => (isLoadingRecipes.value = false));
  }

  function importRecipe(url: string) {
    isLoadingRecipes.value = true;

    return recipesEndpoint
      .importRecipe(url)
      .finally(() => (isLoadingRecipes.value = false));
  }

  function searchRecipes(page = 1, limit = 10) {
    isLoadingRecipes.value = true;

    return recipesEndpoint
      .searchRecipes(
        page,
        limit,
        recipeState.searchQuery.value.type,
        recipeState.searchQuery.value.text
      )
      .then((paginatedRecipes) => {
        currentPage.value = page;

        nextPage.value = paginatedRecipes.next;

        recipeState.recipes.value = paginatedRecipes.result.map(computeRecipe);
      })
      .finally(() => (isLoadingRecipes.value = false));
  }

  function loadMoreRecipes() {
    if (!nextPage.value) {
      return;
    }

    isLoadingRecipes.value = true;

    return recipesEndpoint
      .get(nextPage.value)
      .then((paginatedRecipes) => {
        currentPage.value++;

        nextPage.value = paginatedRecipes.next;

        recipeState.recipes.value.push(
          ...paginatedRecipes.result.map(computeRecipe)
        );
      })
      .finally(() => (isLoadingRecipes.value = false));
  }

  function getRecipe(id: string) {
    isLoadingRecipes.value = true;

    return recipesEndpoint
      .getRecipe(id)
      .then((resultRecipe) => {
        // TODO: remove when all recipes in db are sanitized
        if (resultRecipe.time) {
          resultRecipe.time.preparation = resultRecipe.time.preparation ?? 0;
        }

        recipeState.recipe.value = computeRecipe(resultRecipe);
      })
      .finally(() => (isLoadingRecipes.value = false));
  }

  function getRandomRecipe() {
    isLoadingRecipes.value = true;

    return recipesEndpoint
      .getRandomRecipe()
      .then((randomRecipe) => {
        recipeState.recipe.value = computeRecipe(randomRecipe);
      })
      .finally(() => (isLoadingRecipes.value = false));
  }

  function deleteRecipe(recipe: Recipe) {
    isLoadingRecipes.value = true;

    return recipesEndpoint
      .deleteRecipe(recipe)
      .finally(() => (isLoadingRecipes.value = false));
  }

  function computeRecipe(recipe: ClientRecipe): Recipe {
    const isOwnRecipe =
      !!recipe.authorId &&
      authState.authenticatedUser.value?._id === recipe.authorId;

    const canModifyServings = recipe.ingredients.some(
      (ingredient) => ingredient.quantity && ingredient.quantity > 0
    );

    return {
      ...recipe,
      isOwnRecipe,
      canModifyServings,
      modifiedServings: canModifyServings ? recipe.servings : undefined,
    };
  }

  return {
    addRecipe,
    editRecipe,
    importRecipe,
    searchRecipes,
    loadMoreRecipes,
    getRecipe,
    getRandomRecipe,
    deleteRecipe,
  };
}

export type RecipeService = ReturnType<typeof createRecipeService>;
