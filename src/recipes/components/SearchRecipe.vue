<template>
  <div class="d-flex w-100 searchRow" :class="{ focus: isFocus }">
    <Button v-if="embedded" class="back" @click="$emit('back')">
      <i class="las la-angle-left"></i>
    </Button>
    <input
      @input="changeSearchText()"
      @focus="isFocus = true"
      @blur="isFocus = false"
      ref="searchInput"
      type="text"
      id="search"
      class="w-100"
      :placeholder="'Search by ' + searchQuery.type"
      :value="searchQuery.text"
      autocomplete="off"
    />
    <Button class="searchButton">
      <i class="las la-search"></i>
    </Button>
  </div>

  <div class="switchSearch">
    <Button
      v-if="searchQuery.type !== 'title'"
      @click="changeSearchType('title')"
    >
      Search by title
    </Button>
    <Button
      v-if="searchQuery.type !== 'ingredient'"
      @click="changeSearchType('ingredient')"
    >
      Search by ingredient
    </Button>
    <Button v-if="searchQuery.type !== 'tag'" @click="changeSearchType('tag')">
      Search by tag
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import { SearchType } from '../../../types';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PaginationStatekey, RecipeStateKey } from '../../injectionKeys';

const _ = defineProps({
  embedded: Boolean,
});
const emit = defineEmits(['search', 'back']);

const recipeState = inject(RecipeStateKey)!;
const { setSearch, searchQuery } = recipeState;

const paginationState = inject(PaginationStatekey)!;
const { currentPage } = paginationState;

const searchInput = ref<HTMLInputElement>();

const isFocus = ref(false);

onMounted(() => {
  if (!searchInput.value) {
    return;
  }

  const searchInputTyping = fromEvent(
    searchInput.value,
    'keydown'
  ) as Observable<KeyboardEvent>;

  searchInputTyping.pipe(debounceTime(200)).subscribe(() => emit('search'));
});

function changeSearchType(type: SearchType) {
  setSearch(type, searchQuery.value.text);
}

function changeSearchText() {
  currentPage.value = 1;

  const searchBy = searchQuery.value.type;
  const searchText =
    searchInput.value!.value.length > 0 ? searchInput.value!.value : undefined;

  setSearch(searchBy || 'title', searchText || '');
}
</script>

<style lang="scss" scoped>
.searchRow {
  position: relative;
  background-color: var(--background-contrast-color);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  /* background: linear-gradient(45deg, #f9fffd 20%, #c8f5e6 100%); */
}
.back {
  &:hover {
    background-color: transparent;
  }
  & * {
    color: var(--accent-color);
  }
}

input {
  background-color: transparent;
  padding: 1rem;
  border: none;
  outline: none;
}

.searchButton {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  &:hover {
    background-color: transparent;
  }
  & > i {
    color: var(--accent-color);
    font-size: 24px;
  }
}

.switchSearch {
  display: flex;
  width: fit-content;
  justify-content: space-between;
  margin-top: 0.5rem;
  & > button {
    text-decoration: underline;
    font-size: 14px;
    color: var(--grey-800);
    &:first-child {
      margin-right: 2rem;
      margin-left: 1rem;
    }
  }
}

@media only screen and (min-width: 768px) {
  .searchRow {
    width: 600px;
  }
  .searchRow,
  .switchSearch {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
