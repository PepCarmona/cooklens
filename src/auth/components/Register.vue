<template>
  <div class="auth-container">
    <CustomModal
      :showIf="isShowingVerifyMail"
      @close="isShowingVerifyMail = false"
    >
      <i class="mail-icon las la-envelope"></i>
      <div class="verify-mail">
        We have sent you an email to confirm your account. Please check your
        inbox.
      </div>
      <Button class="closeModal" @click="isShowingVerifyMail = false">
        Got it!
      </Button>
    </CustomModal>
    <CustomInput
      label="Username"
      v-model="user.username"
      type="text"
      id="userName"
      :autoCapitalize="false"
      @keydown.enter="register"
      required
    />

    <CustomInput
      label="Email"
      v-model="user.email"
      type="email"
      id="email"
      :autoCapitalize="false"
      @keydown.enter="register"
      required
    />

    <CustomInput
      label="Password"
      v-model="user.password"
      type="password"
      id="password"
      :autoCapitalize="false"
      @keydown.enter="register"
      required
    />

    <div v-if="false" class="errors">Errors go here</div>

    <Button class="action" @click="register" :loading="isLoadingAuth" primary>
      Register
    </Button>

    <div class="alternative">
      <span>
        Already have an account?
        <RouterLink class="toggle-login" :to="{ name: 'login' }">
          Sign in
        </RouterLink>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, useAttrs } from 'vue';
import CustomInput from '../../shared/CustomInput.vue';
import CustomModal from '../../shared/CustomModal.vue';
import { User, UserInfo } from '../../../types';
import { notify } from '../../shared/Notifications/NotifiactionState';
import { AuthServiceKey, LoadingStateKey } from '../../injectionKeys';

const { nextUrl } = useAttrs();

const user = ref<UserInfo>(new User());

const loadingState = inject(LoadingStateKey)!;
const { isLoadingAuth } = loadingState;

const authService = inject(AuthServiceKey)!;

const isShowingVerifyMail = ref(false);

function register() {
  if (!isValidUser()) {
    return;
  }

  authService
    .register(user.value, nextUrl as string)
    .then(() => (isShowingVerifyMail.value = true))
    .catch((err) => notify(err, 'error'));
}

function isValidUser(): boolean {
  if (!user.value.username) {
    console.error('Username is mandatory');
    return false;
  }

  if (user.value.username.length < 3 || user.value.username.length > 15) {
    console.error('Username must have between 3 and 15 characters');
    return false;
  }

  if (!user.value.password) {
    console.error('Password is mandatory');
    return false;
  }

  const validatedPassword = authService.validatePassword(user.value.password);

  if (!validatedPassword.isValid) {
    console.error(validatedPassword.error);
    return false;
  }

  if (!user.value.email) {
    console.error('Email is mandatory');
    return false;
  }

  return true;
}
</script>

<style lang="scss" scoped>
@import './style/authentication.scss';
</style>
