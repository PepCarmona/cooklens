<template>
  <div class="my-recipes-container">
    <PageHeader @go-back="back">
      <template v-slot:title>My Recipes</template>
    </PageHeader>
    <div class="createRecipe">
      <RouterLink :to="{ name: 'CreateRecipe' }">
        <Button>
          <span>Create Recipe</span>
          <i class="las la-plus"></i>
        </Button>
      </RouterLink>
    </div>
    <LoadingSpinner v-if="isLoadingUser" />
    <RecipeList :recipes="myRecipes" slim />
  </div>
</template>

<script lang="ts" setup>
import { inject, onBeforeMount } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import LoadingSpinner from '../../shared/LoadingSpinner.vue';
import PageHeader from '../../shared/PageHeader.vue';
import RecipeList from '../../recipes/components/RecipeList.vue';
import { LoadingStateKey, UserStateKey } from '../../injectionKeys';

const userState = inject(UserStateKey)!;
const { getMyRecipes, myRecipes } = userState;

const loadingState = inject(LoadingStateKey)!;
const { isLoadingUser } = loadingState;

const router = useRouter();

onBeforeMount(() => getMyRecipes());

function back() {
  router.push({
    name: 'Profile',
  });
}
</script>

<style lang="scss" scoped>
.my-recipes-container {
  background-color: var(--background-color);
}
.createRecipe {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  & > a {
    margin: 0 0.5rem;
  }
  & button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--main-color);
    & > *:last-child {
      margin-left: 0.5rem;
    }
  }
}
</style>
