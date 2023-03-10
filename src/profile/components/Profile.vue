<template>
  <div class="profile-container">
    <PageHeader :canGoBack="false">
      <template v-slot:title>My Profile</template>
      <template v-slot:actions>
        <span class="settings">
          <i class="las la-sliders-h"></i>
        </span>
      </template>
    </PageHeader>
    <div class="user-info-container">
      <div class="user-info">
        <div v-if="authenticatedUser" class="info">
          <div class="username">
            {{ authenticatedUser.username }}
          </div>
          <div class="mail">
            <span v-if="authenticatedUser.email">
              {{ authenticatedUser.email }}
            </span>
            <span v-else>Add email</span>
          </div>
        </div>
        <div class="image"></div>
      </div>
      <div class="links">
        <RouterLink :to="{ name: 'ownRecipes' }">
          <Button>
            <i class="las la-book"></i>
            <span>My Recipes</span>
          </Button>
        </RouterLink>
        <RouterLink :to="{ name: 'favRecipes' }">
          <Button>
            <i class="lar la-heart"></i>
            <span>Favorites</span>
          </Button>
        </RouterLink>
        <RouterLink :to="{ name: 'myMealPlan' }">
          <Button>
            <i class="las la-calendar-week"></i>
            <span>Meal Plan</span>
          </Button>
        </RouterLink>
      </div>
      <div class="more-info">
        <!-- <span class="title">More…</span> -->
        <Button @click="logOut">
          <span>Logout</span>
          <i class="las la-sign-out-alt"></i>
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import PageHeader from '../../shared/PageHeader.vue';
import { AuthServiceKey, AuthStateKey } from '../../injectionKeys';

const router = useRouter();

const authState = inject(AuthStateKey)!;
const { authenticatedUser } = authState;

const authService = inject(AuthServiceKey)!;

function logOut() {
  authService.logOut().then(() => {
    router.push({ name: 'Home' });
  });
}
</script>

<style lang="scss" scoped>
.user-info-container {
  margin: 0 1rem;
}
.user-info {
  display: flex;
  padding: 1rem 0;
}
.info {
  text-align: left;
  flex-grow: 1;
}
.username {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0.5rem;
  letter-spacing: 1.2px;
}
.mail {
  font-size: 14px;
  color: var(--grey-800);
}
.image {
  height: 60px;
  width: 60px;
  border-radius: 60px;
  background-image: url('https://randomuser.me/api/portraits/men/46.jpg');
  background-size: cover;
  background-position: center;
}
.links {
  display: flex;
  justify-content: space-around;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  & button {
    flex-wrap: wrap;
    margin: auto;
  }
  & i {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
    font-size: 28px;
  }
  & span {
    display: block;
    font-size: 14px;
    color: var(--grey-800);
  }
}

.more-info {
  text-align: left;
  margin-top: 4rem;
  & .title {
    display: block;
    margin: 20px 0;
    font-size: 20px;
    font-family: var(--title-font);
  }
  & > button {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}

.la-arrow-right {
  font-size: 16px;
}
</style>
