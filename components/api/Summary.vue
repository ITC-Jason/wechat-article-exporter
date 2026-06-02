<script setup lang="ts">
import { sleep } from '#shared/utils/helpers';
import { request } from '#shared/utils/request';
import CodeSegment from '~/components/api/CodeSegment.vue';
import toastFactory from '~/composables/toast';
import type { GetAuthKeyResult } from '~/types/types';

const toast = toastFactory();
const { t } = useLocale();

const loading = ref(false);
const authKey = ref('');
async function getAuthKey() {
  loading.value = true;
  try {
    await sleep(1000);
    const resp = await request<GetAuthKeyResult>(`/api/public/v1/authkey`);
    if (resp.code === 0) {
      authKey.value = resp.data;
    } else {
      toast.error(t('api.authFailed'), resp.msg);
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <p>
      {{ t('api.summary1') }}
    </p>
    <p class="text-rose-500 font-medium mt-3">
      {{ t('api.notice') }}
    </p>
    <p class="text-rose-500 font-medium mt-1">{{ t('api.privateDeployHint') }}</p>

    <UAlert class="mt-10 mb-3">
      <template #title>
        <h3 class="font-medium text-xl flex items-center space-x-2">
          <UIcon name="i-lucide:key-square" />
          <span>{{ t('api.authKey') }}</span>
        </h3>
      </template>

      <template #description>
        <ol class="list-decimal pl-5 text-base">
          <!--          <li>-->
          <!--            <p>-->
          <!--              由于微信公众号本身的限制，密钥有效期最长为 4 天，且只能通过-->
          <!--              <span class="text-rose-500 font-medium">微信扫码</span> 获取。-->
          <!--            </p>-->
          <!--          </li>-->
          <li>
            <p>{{ t('api.authKeyIntro') }}</p>
            <p>{{ t('api.authHeader') }}</p>
            <p>{{ t('api.authCookie') }}</p>
          </li>
          <li>
            <p>
              <span
                >{{ t('api.authIntegrated') }}</span
              >
            </p>
          </li>
          <li>
            <p>
              <span>{{ t('api.authExpires') }}</span>
            </p>
          </li>
        </ol>
        <UButton class="mt-3" color="blue" :loading="loading" @click="getAuthKey">
          {{ t('api.queryAuthKey') }}
        </UButton>
        <div v-if="authKey">
          <p class="mt-5 mb-2">{{ t('api.currentAuthKey') }}</p>
          <CodeSegment :code="authKey" lang="text" class="max-w-xl" />
        </div>
      </template>
    </UAlert>
  </div>
</template>
