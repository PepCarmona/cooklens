<template>
  <div class="rating-container">
    <div class="rating">
      <Button
        v-for="rating in ratings"
        :key="rating"
        @click="rate(rating)"
        :class="{ disabled: onlyDisplay }"
      >
        <i v-if="recipeRating >= rating" class="las la-star"></i>
        <i v-else class="lar la-star"></i>
      </Button>
    </div>
    <div v-if="clicked && showComment" class="comment">
      <textarea
        name="ta"
        id="ta"
        placeholder="Leave your optional comment"
      ></textarea>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

const props = defineProps({
  recipeRating: {
    type: Number,
    required: true,
  },
  maxRating: {
    type: Number,
    default: 5,
  },
  size: {
    type: String,
    default: 'xl',
  },
  onlyDisplay: Boolean,
  showComment: Boolean,
});
const emit = defineEmits(['rate']);

const clicked = ref(false);

const ratings = computed(() => {
  let ratingArray = [];
  for (let i = 1; i <= props.maxRating; i++) {
    ratingArray.push(i);
  }
  return ratingArray;
});

function rate(number: number) {
  clicked.value = true;
  emit('rate', number);
}
</script>

<style lang="scss" scoped>
button:focus,
button:hover {
  background-color: transparent;
}
button.disabled {
  pointer-events: none;
}
textarea {
  width: 100%;
  min-height: 100px;
}

.rating-container {
  height: fit-content;
  width: fit-content;
}
.rating {
  display: flex;
  justify-content: center;
  & i {
    font-size: 32px;
  }
}

.lar.la-star {
  color: var(--accent-color-transparent);
}
.las.la-star {
  color: var(--accent-color);
}
</style>
