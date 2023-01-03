<template>
  <div class="auth-container">
    <CustomModal
      :showIf="isShowingRecoveryMail"
      @close="isShowingRecoveryMail = false"
    >
      <i class="mail-icon las la-envelope"></i>
      <div class="verify-mail">
        We have sent you an email to recover your password. Please check your
        inbox.
      </div>
      <Button class="closeModal" @click="isShowingRecoveryMail = false">
        Got it!
      </Button>
    </CustomModal>

    <template v-if="token">
      <CustomInput
        label="Password"
        v-model="user.password"
        type="password"
        id="password"
        :autoCapitalize="false"
        @keydown.enter="changePassword"
        required
      />
    </template>
    <template v-else>
      <CustomInput
        label="Email"
        v-model="user.email"
        type="email"
        id="email"
        :autoCapitalize="false"
        @keydown.enter="recoverPassword"
        required
      />

      <div v-if="false" class="errors">Errors go here</div>

      <Button
        class="action"
        @click="recoverPassword"
        :loading="isLoadingAuth"
        primary
      >
        Send recovery mail
      </Button>

      <div class="alternative">
        <span>
          <RouterLink class="toggle-login" :to="{ name: 'login' }">
            Back to login
          </RouterLink>
        </span>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, useAttrs } from 'vue';
import CustomInput from '../../shared/CustomInput.vue';
import CustomModal from '../../shared/CustomModal.vue';
import { User, UserInfo } from '../../../types';
import { notify } from '../../shared/Notifications/NotifiactionState';
import { AuthServiceKey, LoadingStateKey } from '../../injectionKeys';

const { token, mail } = useAttrs();

const user = ref<UserInfo>(new User());

const loadingState = inject(LoadingStateKey)!;
const { isLoadingAuth } = loadingState;

const authService = inject(AuthServiceKey)!;

const isShowingRecoveryMail = ref(false);

function recoverPassword() {
  if (!user.value.email) {
    return;
  }

  authService
    .recoverPassword(user.value)
    .then(() => (isShowingRecoveryMail.value = true))
    .catch((err) => notify(err, 'error'));
}

function changePassword() {
  // const validatedPassword = authService.validatePassword(user.value.password);
  // if (!validatedPassword.isValid) {
  //   console.error(validatedPassword.error);
  //   return;
  // }
  // authService
  //   .changePassword(mail, token, user.value.password)
  //   .then()
  //   .catch((err) => notify(err, 'error'));
}

function isValidUser(): boolean {
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
