<template>
  <div class="auth-container">
    <CustomInput
      label="Username"
      v-model="user.username"
      type="text"
      id="userName"
      :autoCapitalize="false"
      @keydown.enter="logIn"
      required
    />

    <CustomInput
      label="Password"
      v-model="user.password"
      type="password"
      id="password"
      :autoCapitalize="false"
      @keydown.enter="logIn"
      required
    />

    <div v-if="false" class="errors">Errors go here</div>

    <Button class="action" @click="logIn" :loading="isLoadingAuth" primary>
      Login
    </Button>
    <div class="alternative">
      <span>
        <RouterLink class="toggle-login" :to="{ name: 'forgotPassword' }"
          >Forgot password?</RouterLink
        >
      </span>
      |
      <span>
        No account yet?
        <RouterLink class="toggle-login" :to="{ name: 'register' }">
          Register
        </RouterLink>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, useAttrs } from 'vue';
import { useRouter } from 'vue-router';
import CustomInput from '../../shared/CustomInput.vue';
import { notify } from '../../shared/Notifications/NotifiactionState';
import { User, UserInfo } from '../../../types';
import { AuthServiceKey, LoadingStateKey } from '../../injectionKeys';

const { nextUrl } = useAttrs();

const router = useRouter();
const user = ref<UserInfo>(new User());

const loadingState = inject(LoadingStateKey)!;
const { isLoadingAuth } = loadingState;

const authService = inject(AuthServiceKey)!;

function logIn() {
  if (!isValidUser()) {
    return;
  }

  authService
    .logIn(user.value)
    .then(() => router.push(nextUrl ?? { name: 'Profile' }))
    .catch((err) => notify(err, 'error'));
}

function isValidUser(): boolean {
  if (!user.value.username) {
    console.error('Username is mandatory');
    return false;
  }

  if (!user.value.password) {
    console.error('Password is mandatory');
    return false;
  }

  return true;
}
</script>

<style lang="scss" scoped>
@import './style/authentication.scss';
</style>
