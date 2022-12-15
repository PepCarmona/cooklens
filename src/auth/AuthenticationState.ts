import { ref } from 'vue';

import { UserInfo } from '../../types';

const authenticatedUser = ref<UserInfo | null>();
const token = ref(localStorage.getItem('userToken') || '');

export const authState = {
  authenticatedUser,
  token,
};

export type AuthenticationState = typeof authState;
