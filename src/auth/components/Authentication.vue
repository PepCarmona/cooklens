<template>
  <div class="authentication">
    <div class="auth-back" @click="goBack">
      <i class="las la-angle-left"></i>
    </div>
    <div class="cover-image"></div>
    <div class="form">
      <RouterLink class="title" to="/">Cooklens</RouterLink>
      <div class="subtitle">Just enjoy cooking</div>
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts">
let prevRoute: string | undefined;

export default {
  beforeRouteEnter(to, from) {
    prevRoute = from.name?.toString();
  },
};
</script>

<script lang="ts" setup>
import { useAttrs } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const attrs = useAttrs();

const router = useRouter();
const nextUrl = attrs.nextUrl as string;

function goBack() {
  if (prevRoute) {
    router.back();
  } else {
    router.push({ name: 'Home' });
  }
}
</script>

<style lang="scss" scoped>
@import './style/authentication.scss';
</style>
