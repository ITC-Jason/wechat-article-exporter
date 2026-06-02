<template>
  <USelectMenu
    v-model="selected"
    size="md"
    color="gray"
    searchable
    :searchable-placeholder="t('selector.accountSearchPlaceholder')"
    clear-search-on-close
    :options="sortedAccountInfos"
    option-attribute="nickname"
    :placeholder="t('selector.accountPlaceholder')"
  >
    <template #label>
      <UAvatar v-if="selected" :src="selected.round_head_img" size="2xs" />
      <span v-if="selected" class="max-w-30 line-clamp-1">{{ selected.nickname }}</span>
      <span v-if="selected" class="shrink-0">{{ t('selector.articles', { count: selected.articles }) }}</span>
    </template>
    <template #option="{ option: account }">
      <UAvatar :src="account.round_head_img" size="sm" />
      <div>
        <p class="text-[16px]">{{ account.nickname }}</p>
        <p class="text-gray-500 text-sm">{{ t('selector.loadedArticles', { count: account.articles }) }}</p>
      </div>
    </template>
    <template #option-empty="{ query }">
      {{ t('selector.noMatch', { query }) }}<br />{{ t('selector.addBefore') }}「<NuxtLink
        to="/dashboard/account"
        class="text-blue-500 hover:underline"
        >{{ t('account.title') }}</NuxtLink
      >」{{ t('selector.addAfter') }}
    </template>
    <template #empty>
      {{ t('selector.noAccount') }}，{{ t('selector.addBefore') }}「<NuxtLink
        to="/dashboard/account"
        class="text-blue-500 hover:underline"
        >{{ t('account.title') }}</NuxtLink
      >」{{ t('selector.addAfter') }}
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
import { getAllInfo, type MpAccount } from '~/store/v2/info';

const { t } = useLocale();

// 已缓存的公众号信息
const cachedAccountInfos = await getAllInfo();
const sortedAccountInfos = computed(() => {
  cachedAccountInfos.sort((a, b) => {
    return a.articles > b.articles ? -1 : 1;
  });
  return cachedAccountInfos;
});

const selected = defineModel<MpAccount | undefined>();
</script>
