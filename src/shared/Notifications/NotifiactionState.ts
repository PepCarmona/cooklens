import { ref } from 'vue';
import { DEFAULT_OPEN_TIME, NotificationType } from './NotificationTypes';

const notificationType = ref<NotificationType>('light');
const notificationMessage = ref('');

const showNotification = ref(false);
const autoCloseNotification = ref(true);

export function notify(
  msg: string,
  type: NotificationType = 'light',
  autoClose = true
) {
  notificationType.value = type;
  notificationMessage.value = msg;

  showNotification.value = true;
  autoCloseNotification.value = autoClose;

  if (autoCloseNotification.value) {
    setTimeout(() => closeNotification(), DEFAULT_OPEN_TIME);
  }
}

function closeNotification() {
  showNotification.value = false;
}

export default function createNotificationState() {
  return {
    notificationType,
    notificationMessage,
    showNotification,
    autoCloseNotification,

    closeNotification,
  };
}

export type NotificationState = ReturnType<typeof createNotificationState>;
