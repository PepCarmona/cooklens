<template>
  <div class="auth-container">
    <CustomInput
      label="New Password"
      v-model="newPassword"
      type="password"
      id="password"
      :autoCapitalize="false"
      @keydown.enter="changePassword"
      required
    />

    <Button
      class="action"
      @click="changePassword"
      :disabled="!newPassword"
      primary
    >
      Update password
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, useAttrs } from 'vue';
import { useRouter } from 'vue-router';
import CustomInput from '../../shared/CustomInput.vue';
import { notify } from '../../shared/Notifications/NotifiactionState';
import { AuthServiceKey } from '../../injectionKeys';

const { token, mail } = useAttrs();

const router = useRouter();

const newPassword = ref<string>();

const authService = inject(AuthServiceKey)!;

function changePassword() {
  if (!newPassword.value) {
    return;
  }
  const validatedPassword = authService.validatePassword(newPassword.value);
  if (!validatedPassword.isValid) {
    console.error(validatedPassword.error);
    return;
  }
  authService
    .changePassword(mail as string, token as string, newPassword.value)
    .then(() => {
      router
        .push({ name: 'login' })
        .then(() => notify('Password updated', 'success'));
    })
    .catch((err) => notify(err, 'error'));
}
</script>

<style lang="scss" scoped>
@import './style/authentication.scss';
</style>
