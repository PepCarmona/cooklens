<template>
  <button
    @click.stop="!loading && $emit('click')"
    :class="{ loading, primary, secondary, 'secondary-light': secondaryLight }"
    :disabled="loading || disabled"
  >
    <LoadingSpinner v-if="loading" />
    <slot v-else />
  </button>
</template>

<script lang="ts" setup>
import LoadingSpinner from '../shared/LoadingSpinner.vue';

defineProps({
  loading: Boolean,
  disabled: Boolean,
  primary: Boolean,
  secondary: Boolean,
  secondaryLight: Boolean,
});
defineEmits(['click']);
</script>

<style lang="scss" scoped>
button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 200ms linear;
  &:focus {
    background-color: var(--grey-100);
  }
  &:hover {
    background-color: var(--grey-100);
  }
}

button.primary {
  background-color: var(--accent-color);
  &.loading {
    cursor: progress;
  }
  &:disabled {
    background-color: var(--accent-color-light) !important;
    pointer-events: none;
  }
  &:focus {
    background-color: var(--accent-color-hover);
  }
  &:hover {
    background-color: var(--accent-color-hover);
  }
}
button.secondary {
  background-color: var(--accent-color-complementary);
}
button.secondary-light {
  background-color: var(--grey-800);
}

button.primary,
button.secondary,
button.secondary-light,
button.primary *,
button.secondary *,
button.secondary-light * {
  color: var(--inverted-text-color);
}
</style>
