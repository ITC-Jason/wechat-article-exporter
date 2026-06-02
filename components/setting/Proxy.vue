<template>
  <UCard class="mx-4 mt-10">
    <template #header>
      <h3 class="text-2xl font-semibold">{{ t('settings.proxy.title') }}</h3>
      <p class="text-sm text-slate-10 font-serif">
        {{ t('settings.proxy.emptyBefore') }}
        <ExternalLink :href="docsWebSite + '/get-started/proxy.html'" :text="t('settings.proxy.publicProxy')" />
        {{ t('settings.proxy.emptyAfter') }}
      </p>
      <p v-if="isEnvProxyConfigured" class="text-sm text-amber-600 mt-2">
        {{ t('settings.proxy.envHint') }}
      </p>
      <p>
        <ExternalLink :href="docsWebSite + '/get-started/private-proxy.html'" :text="t('settings.proxy.setupProxy')" />
      </p>
    </template>

    <div class="flex space-x-10">
      <textarea
        class="h-[400px] flex-1 p-2 border rounded resize-none font-mono"
        v-model="textareaValue"
        spellcheck="false"
        :readonly="isEnvProxyConfigured"
        :placeholder="t('settings.proxy.placeholder')"
      ></textarea>
      <div class="flex-1 flex-shrink-0">
        <div class="my-5">
          <p>{{ t('settings.proxy.requirements') }}</p>
          <ol>
            <li>
              <p>{{ t('settings.proxy.requireAbsolute') }}</p>
              <p>
                {{ t('settings.proxy.requireQuery') }}
              </p>
            </li>
          </ol>
          <p class="mt-3">{{ t('settings.proxy.example') }}</p>
          <p><code class="text-rose-500 font-mono">https://wproxy-01.deno.dev</code></p>
          <p><code class="text-rose-500 font-mono">https://wproxy-01.deno.dev/</code></p>
        </div>
        <UButton
          type="submit"
          @click="save"
          color="black"
          class="w-20 mt-5 justify-center disabled:bg-slate-10"
          :disabled="isEnvProxyConfigured"
          >{{ saveBtnText }}</UButton
        >
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import ExternalLink from '~/components/base/ExternalLink.vue';
import { docsWebSite } from '~/config';
import type { Preferences } from '~/types/preferences';
import { parseProxyList, resolveProxyList } from '~/utils/proxy-list';

const preferences: Ref<Preferences> = usePreferences() as unknown as Ref<Preferences>;
const runtimeConfig = useRuntimeConfig();
const { t } = useLocale();

const textareaValue = ref('');
const envProxyList = computed(() => parseProxyList(String(runtimeConfig.public.proxyList ?? '')));
const isEnvProxyConfigured = computed(() => envProxyList.value.length > 0);
const proxyList = computed(() => {
  return textareaValue.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && line.startsWith('http'));
});

onMounted(() => {
  try {
    const configuredProxyList = resolveProxyList(
      String(runtimeConfig.public.proxyList ?? ''),
      (preferences.value as Preferences).privateProxyList
    );
    if (configuredProxyList.length > 0) {
      textareaValue.value = configuredProxyList.join('\n');
    }
  } catch (e) {}
});

const saveBtnState = ref<'idle' | 'saved' | 'env'>('idle');
const saveBtnText = computed(() => {
  if (saveBtnState.value === 'env') return t('settings.proxy.envSaveDisabled');
  if (saveBtnState.value === 'saved') return t('common.saved');
  return t('common.save');
});
async function save() {
  if (isEnvProxyConfigured.value) {
    saveBtnState.value = 'env';
    return;
  }
  saveBtnState.value = 'saved';
  setTimeout(() => {
    (preferences.value as Preferences).privateProxyList = proxyList.value;
    saveBtnState.value = 'idle';
  }, 1000);
}
</script>
