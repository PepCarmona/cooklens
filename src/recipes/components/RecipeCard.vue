<template>
  <div class="card" :class="{ embedded }" @click="openRecipeDetails">
    <!-- <div
            v-if="!recipe.images || !recipe.images.length > 0"
            class="image"
            :style="`background: url(https://via.placeholder.com/400x300.webp) center center / cover;`"
            :alt="recipe.title"
        ></div> -->
    <div
      v-if="recipe.images && recipe.images.length > 0"
      class="image-container"
    >
      <div
        class="image"
        :style="`background: url(${recipe.images[0]}) center center / cover;`"
        :alt="recipe.title"
      ></div>
    </div>
    <div class="content d-flex p-1">
      <div class="head">
        <div class="title">
          {{ recipe.title }}
        </div>
        <div v-if="authenticatedUser" class="fav">
          <i
            v-if="isFavoriteRecipe(recipe)"
            @click.stop="toggleFavRecipe(recipe)"
            class="las la-heart"
          ></i>
          <i
            v-else
            @click.stop="toggleFavRecipe(recipe)"
            class="lar la-heart"
          ></i>
        </div>
      </div>

      <div class="details">
        <div class="rating">
          <i class="lar la-star"></i> <span>{{ recipe.rating }}</span>
        </div>
        <div v-if="recipe.time" class="time">
          <i class="las la-clock"></i>
          <span>{{ formattedTime }}</span>
        </div>
        <div v-if="!recipe.isIntegrated" class="link-icon">
          <i class="las la-link"></i>
        </div>
      </div>
      <div v-if="recipe.tags && recipe.tags.length > 0" class="row">
        <div class="pill mx-05" v-for="tag in recipe.tags" :key="tag._id">
          {{ tag.value }}
        </div>
      </div>
    </div>
    <div v-if="showActions" class="actions">
      <Button @click="$emit('select-recipe', recipe)">
        <i class="las la-plus"></i>
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, PropType } from 'vue';
import { useRouter } from 'vue-router';
import { ClientRecipe } from '../../../types';
import {
  AuthStateKey,
  RecipeStateKey,
  UserStateKey,
} from '../../injectionKeys';

const props = defineProps({
  recipe: {
    type: Object as PropType<ClientRecipe>,
    required: true,
  },
  embedded: Boolean,
  showActions: Boolean,
});
const emit = defineEmits(['select-recipe', 'see-more-info']);

const router = useRouter();

const authState = inject(AuthStateKey)!;
const { authenticatedUser } = authState;

const userState = inject(UserStateKey)!;
const { toggleFavRecipe } = userState;

const recipeState = inject(RecipeStateKey)!;
const { isFavoriteRecipe } = recipeState;

const formattedTime = computed(() => {
  if (!props.recipe.time) {
    return;
  }
  const totalTime = props.recipe.time.preparation
    ? props.recipe.time.preparation + props.recipe.time.cooking
    : props.recipe.time.cooking;

  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  const formattedTime =
    hours > 0 ? `${hours} h  ${minutes} min` : `${minutes} min`;

  return formattedTime;
});

function openRecipeDetails() {
  if (props.showActions) {
    emit('see-more-info', props.recipe);
    return;
  }

  const formattedTitle = props.recipe.title.toLowerCase().replaceAll(' ', '-');

  router.push({
    name: 'RecipeDetails',
    params: { title: formattedTitle },
    query: { id: props.recipe._id!, cgb: 'true' },
  });
}
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 400px;
  background-color: var(--background-contrast-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  &.embedded {
    display: flex;
    min-height: calc(2rem + 60px);
    border: none;
    border-radius: 0;
    margin: 0;
    border-bottom: 1px solid var(--shadow-color);
    max-width: none;
    flex-direction: row;
    transition: all 200ms linear;
    &:hover {
      background-color: var(--grey-100);
      border-radius: 10px;
    }

    & .image-container {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
      align-self: center;
    }

    & .image {
      margin: 0;
      border-radius: 0.5rem;
    }

    & .content {
      min-height: auto;
    }

    & .title {
      font-size: 16px;
    }

    & .details {
      margin-top: 0.5rem;
      & span {
        font-size: 14px;
      }
      & i {
        font-size: 16px;
      }
    }

    & .fav {
      display: none;
    }

    & .time {
      align-items: center;
      min-width: 110px;
      margin-left: 1rem;
      padding-right: 1rem;
    }

    & .rating {
      align-items: center;
    }

    & .link-icon {
      min-width: 110px;
      margin-left: 1rem;
      padding-right: 1rem;
    }
  }

  &.pointer {
    cursor: pointer;
  }
}

.image-container {
  height: 280px;
}
.image {
  height: 100%;
}

.content {
  flex-wrap: wrap;
  min-height: 160px;
}

.head {
  display: flex;
  width: 100%;
  align-items: flex-start;
}
.title {
  width: 100%;
  text-align: left;
  font-family: var(--title-font);
  font-size: 24px;
}

.details {
  display: flex;
  width: 100%;
  margin-top: 1rem;
  justify-content: flex-end;
  align-self: flex-end;
  & span {
    font-size: 18px;
    margin-left: 0.5rem;
    color: var(--grey-800);
  }
  & i {
    color: var(--grey-600);
  }
}

.fav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  margin-left: 2rem;
  & > i {
    font-size: 32px;
    color: var(--accent-color);
  }
}

.rating {
  display: flex;
  cursor: pointer;
}

.time,
.link-icon {
  display: flex;
  margin-left: 2rem;
  min-width: 130px;
  justify-content: flex-end;
}

.pill {
  position: relative;
  width: fit-content;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  background: var(--main-color);
  border-radius: 20px;
  color: var(--main-light-color);
}

.mealPlanButtons {
  display: flex;
  margin-top: 1rem;
  & > * {
    width: 50%;
    padding: 0.5rem;
    background-color: var(--secondary-light-color);
    &:hover {
      background-color: var(--secondary-color);
    }
  }
}

.actions {
  padding: 1rem 0;
  height: 91px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & > button:hover {
    background-color: var(--grey-200);
  }
  & i {
    font-size: 28px;
  }
}

@media only screen and (min-width: 769px) {
  .card {
    flex-direction: row;
  }
  .image-container {
    height: auto;
    width: 100%;
  }
}
</style>
