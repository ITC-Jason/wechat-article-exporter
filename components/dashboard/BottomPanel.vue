<script setup lang="ts">
import { formatDistance } from 'date-fns';
import { request } from '#shared/utils/request';
import LoginModal from '~/components/modal/Login.vue';
import StorageUsage from '~/components/StorageUsage.vue';
import { IMAGE_PROXY } from '~/config';
import type { LogoutResponse } from '~/types/types';

const loginAccount = useLoginAccount();
const modal = useModal();
const { t } = useLocale();

function hasAuthKeyCookie(): boolean {
  return document.cookie.split(';').some(item => item.trim().split('=')[0] === 'auth-key');
}

const hasAuthKey = computed(() => hasAuthKeyCookie());

const now = ref(new Date());
const distance = computed(() => {
  return (
    loginAccount.value &&
    formatDistance(new Date(loginAccount.value.expires), now.value, {
      includeSeconds: true,
      locale: {
        formatDistance: function (token, count, options) {
          if (now.value >= new Date(loginAccount.value.expires)) {
            window.clearInterval(timer);
            setTimeout(() => {
              loginAccount.value = null;
            }, 0);
            return t('common.expired');
          }

          switch (token) {
            case 'aboutXHours':
              return t('dashboard.bottom.about', { count, unit: t('common.hours') });
            case 'aboutXMonths':
              return t('dashboard.bottom.about', { count, unit: t('common.months') });
            case 'aboutXWeeks':
              return t('dashboard.bottom.about', { count, unit: t('common.weeks') });
            case 'aboutXYears':
              return t('dashboard.bottom.about', { count, unit: t('common.years') });
            case 'lessThanXMinutes':
              return t('dashboard.bottom.lessThan', { count, unit: t('common.minutes') });
            case 'almostXYears':
              return t('dashboard.bottom.closeTo', { count });
            case 'halfAMinute':
              return t('dashboard.bottom.halfMinute');
            case 'lessThanXSeconds':
              return t('dashboard.bottom.lessThan', { count, unit: t('common.seconds') });
            case 'overXYears':
              return t('dashboard.bottom.over', { count });
            case 'xDays':
              return `${count}${t('common.days')}`;
            case 'xHours':
              return `${count}${t('common.hours')}`;
            case 'xMinutes':
              return `${count}${t('common.minutes')}`;
            case 'xMonths':
              return `${count}${t('common.months')}`;
            case 'xSeconds':
              return `${count}${t('common.seconds')}`;
            case 'xWeeks':
              return `${count}${t('common.weeks')}`;
            case 'xYears':
              return `${count}${t('common.years')}`;
            default:
              return 'unknown';
          }
        },
      },
    })
  );
});
const warning = computed(() => {
  if (!loginAccount.value) return false;
  return new Date(loginAccount.value.expires).getTime() - now.value.getTime() < 60 * 60 * 1000;
});

function login() {
  modal.open(LoginModal);
}

const logoutBtnLoading = ref(false);

function deleteAuthKeyCookie() {
  document.cookie = 'auth-key=; path=/; max-age=0; secure';
}

async function logout() {
  logoutBtnLoading.value = true;
  try {
    const { statusCode, statusText } = await request<LogoutResponse>('/api/web/mp/logout');
    if (statusCode === 200) {
      loginAccount.value = null;
    } else {
      console.error(t('dashboard.bottom.logoutError'), statusText);
    }
  } finally {
    deleteAuthKeyCookie();
    logoutBtnLoading.value = false;
    window.location.reload();
  }
}

let timer: number;
onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
});
onUnmounted(() => {
  window.clearInterval(timer);
});
</script>

<template>
  <footer class="flex flex-col space-y-2 pt-3 border-t dark:border-slate-600">
    <div v-if="loginAccount && hasAuthKey" class="space-y-3">
      <div class="flex items-center space-x-2">
        <img
          v-if="loginAccount.avatar"
          :src="IMAGE_PROXY + loginAccount.avatar"
          alt=""
          class="rounded-full size-10 ring-1 ring-gray-300"
        />
        <UTooltip
          v-if="loginAccount.nickname"
          class="flex-1 overflow-hidden"
          :popper="{ placement: 'top-start', offsetDistance: 16 }"
        >
          <template #text>
            <span>{{ loginAccount.nickname }}</span>
          </template>
          <span class="whitespace-nowrap text-ellipsis overflow-hidden">{{ loginAccount.nickname }}</span>
        </UTooltip>

        <UButton
          icon="i-heroicons-arrow-left-start-on-rectangle-16-solid"
          :loading="logoutBtnLoading"
          class="bg-slate-10 hover:bg-rose-500 disabled:bg-rose-500"
          @click="logout"
          >{{ t('dashboard.bottom.logout') }}
        </UButton>
      </div>
      <div class="text-sm">
        <span>{{ t('dashboard.bottom.expiresIn') }}</span>
        <span class="font-mono" :class="warning ? 'text-rose-500' : 'text-green-500'">{{ distance }}</span>
      </div>
    </div>
    <div v-else>
      <UButton color="gray" variant="solid" @click="login">{{ t('dashboard.bottom.login') }}</UButton>
    </div>
    <StorageUsage />
  </footer>
</template>
