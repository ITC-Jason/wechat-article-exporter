<template>
  <div class="h-full">
    <Teleport defer to="#title">
      <h1 class="text-[28px] leading-[34px] text-slate-12 dark:text-slate-50 font-bold">{{ t('proxy.title') }}</h1>
    </Teleport>

    <div class="flex flex-col h-full divide-y divide-gray-200">
      <!-- header -->
      <header class="px-4 py-5 sm:px-6">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-2xl font-semibold">{{ t('proxy.stats') }}</h2>

          <p class="font-serif font-bold">{{ t('proxy.available', { success: totalSuccess, failure: totalFailure }) }}</p>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-rose-500 text-sm">
            {{ t('proxy.warning') }}<br />
            {{ t('proxy.abuseWarning') }}
          </p>
          <p class="mt-2 px-3 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-300 rounded-md dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-700">
            {{ t('proxy.quotaRefresh') }}
          </p>
          <UPopover :popper="{ placement: 'left-start', arrow: true }">
            <UButton
              :icon="hasBlocked ? 'i-lucide:annoyed' : 'i-lucide:smile'"
              variant="link"
              :color="hasBlocked ? 'rose' : 'green'"
            />

            <template #panel>
              <div class="p-4 space-y-3 max-h-80 overflow-y-scroll">
                <div>
                  <p>{{ t('proxy.currentIP') }}</p>
                  <code class="font-medium" :class="hasBlocked ? 'text-rose-500' : 'text-green-500'">
                    {{ currentIP }}
                  </code>
                </div>
                <div>
                  <p class="flex justify-between items-center min-w-64">
                    <span>{{ t('proxy.blockedIP') }}</span>
                    <span class="text-xs text-gray-500">{{ t('proxy.falsePositive') }}</span>
                  </p>
                  <ul>
                    <li v-for="ip in blockedIPS" :key="ip">
                      <code class="text-rose-500">{{ ip }}</code>
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </UPopover>
        </div>
      </header>

      <!-- 数据展示区 -->
      <div class="flex-1 px-4 py-5 sm:py-6 overflow-y-scroll">
        <div v-if="loading" class="flex justify-center items-center mt-5">
          <Loader :size="28" class="animate-spin text-slate-500" />
        </div>
        <ProxyMetrics :data="metricsData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader } from 'lucide-vue-next';
import { request } from '#shared/utils/request';
import ProxyMetrics from '~/components/ProxyMetrics.vue';
import type { AccountMetric } from '~/types/proxy';

const { t } = useLocale();

useHead({
  title: computed(() => `${t('proxy.title')} | ${t('site.name')}`),
});

const loading = ref(false);
const metricsData = ref<AccountMetric[]>([]);

const totalSuccess = computed(
  () => metricsData.value.filter(item => item.metric && item.metric.dailyRequests < 100_000).length
);
const totalFailure = computed(
  () => metricsData.value.filter(item => item.metric && item.metric.dailyRequests >= 100_000).length
);

async function getMetricsData() {
  loading.value = true;
  try {
    metricsData.value = await fetch('/api/web/worker/overview-metrics')
      .then(res => res.json())
      .catch(e => {
        throw e;
      });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

const currentIP = ref('');
const blockedIPS = ref<string[]>([]);

onMounted(async () => {
  await Promise.all([
    getMetricsData(),
    request('/api/web/misc/current-ip').then(data => {
      currentIP.value = data.ip;
    }),
    request<{ ips: string[] } | string[]>('/api/web/worker/blocked-ip-list').then(data => {
      blockedIPS.value = Array.isArray(data) ? data : data.ips || [];
    }),
  ]);
});
const hasBlocked = computed(() => {
  return blockedIPS.value.includes(currentIP.value);
});
</script>
