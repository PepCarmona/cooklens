<template>
  <CustomModal
    v-if="showHeader"
    :showIf="showMenu"
    @close="showMenu = false"
    :mode="mode"
  >
    <div class="slide-menu">
      <span class="menu-close" @click="showMenu = false">
        <i class="las la-times"></i>
      </span>
      <RouterLink @click="showMenu = false" to="/" class="menu-title">
        Cooklens
      </RouterLink>
      <div class="items">
        <RouterLink @click="showMenu = false" to="/recipes">
          Recipes
        </RouterLink>
        <template v-if="!!authenticatedUser">
          <RouterLink @click="showMenu = false" to="/profile">
            My Profile
          </RouterLink>
          <RouterLink @click="showMenu = false" to="/profile/myMealPlan">
            My Meal Plan
          </RouterLink>
        </template>
        <RouterLink v-else @click="showMenu = false" to="/auth">
          Login
        </RouterLink>
        <RouterLink @click="showMenu = false" to="/recipe/form">
          Add recipe
        </RouterLink>
        <RouterLink @click="showMenu = false" to="/recipe/random?random=true">
          Random recipe
        </RouterLink>
      </div>
    </div>
  </CustomModal>
  <header v-if="showHeader">
    <div id="menu-mobile" class="menu">
      <span @click="showMenu = true"><i class="las la-bars"></i></span>
    </div>
    <div id="title">
      <RouterLink to="/">Cooklens</RouterLink>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import CustomModal, { modalLateralMode } from '../shared/CustomModal.vue';
import { AuthStateKey } from '../injectionKeys';

const route = useRoute();

const showMenu = ref(false);
const showHeader = computed(() => !route.meta.noHeader);

const authState = inject(AuthStateKey)!;
const { authenticatedUser } = authState;

const mode = ref(getModalMode());

window.addEventListener('resize', () => {
  mode.value = getModalMode();
});

function getModalMode(): modalLateralMode {
  if (screen.width > 768) {
    return 'left';
  }
  return 'top';
}
</script>

<style lang="scss" scoped>
header {
  position: relative;
  display: flex;
  height: 50px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  z-index: 99;
  backdrop-filter: blur(12px);
}

#title {
  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
  width: 100%;
  padding-bottom: 4px;
  margin-left: -4rem;
  & > a {
    text-decoration: none;
    font-size: 24px;
    font-family: var(--title-font);
    font-weight: 200;
  }
}

.menu {
  margin-left: 1rem;
  flex-shrink: 0;
  z-index: 9;
  & > span {
    cursor: pointer;
  }
}
.menu-title {
  display: block;
  font-family: var(--title-font);
  font-weight: 200;
  font-size: 30px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: var(--accent-color);
}
.menu-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: var(--dark-shadow-color);
  backdrop-filter: blur(1px);
}

.slide-menu {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  height: fit-content;
  padding-bottom: 3rem;
  width: 100%;
  & a.RouterLink-exact-active {
    color: var(--accent-color);
  }
  & .items {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    & > * {
      width: 100%;
      padding: 1rem;
      padding-left: 0;
      text-align: left;
      transition: all 200ms linear;
      &:not(.RouterLink-exact-active):hover {
        color: var(--grey-600);
      }
      &:not(:last-child) {
        border-bottom: 1px solid var(--accent-color-transparent);
      }
    }
  }
}

@media only screen and (min-width: 767px) {
  header {
    height: 60px;
  }
  #title {
    text-align: left;
    position: relative;
    padding-bottom: 6px;
    margin-left: 0;
    & > a {
      font-size: 28px;
    }
  }

  .menu {
    display: block;
    text-align: right;
    margin-right: 1rem;
  }

  .menu-close {
    left: 1rem;
    right: auto;
  }
  .menu-title {
    margin-top: -1.1rem;
    margin-left: 2rem;
    margin-bottom: 2rem;
  }
  .slide-menu {
    padding-bottom: 1rem;
    & .items {
      margin-left: 2rem;
      flex-direction: column;
      & > * {
        padding: 1rem;
        font-size: 18px;
      }
    }
  }
}
</style>
