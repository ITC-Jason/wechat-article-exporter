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
      <UAvatar v-if="selected" :src="IMAGE_PROXY + selected.round_head_img" size="2xs" />
      <span v-if="selected" class="max-w-30 line-clamp-1">{{ selected.nickname }}</span>
      <span v-if="selected" class="shrink-0">{{ t('selector.albums', { count: selected.albums!.length }) }}</span>
    </template>
    <template #option="{ option: account }">
      <UAvatar :src="IMAGE_PROXY + account.round_head_img" size="sm" />
      <div>
        <p class="text-[16px]">{{ account.nickname }}</p>
        <p class="text-gray-500 text-sm">{{ t('selector.albumCount', { count: account.albums.length }) }}</p>
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
import { IMAGE_PROXY } from '~/config';
import { getArticleCache } from '~/store/v2/article';
import { getAllInfo, type MpAccount } from '~/store/v2/info';
import type { AppMsgAlbumInfo } from '~/types/types';

const { t } = useLocale();

interface AccountInfo extends MpAccount {
  albums?: AppMsgAlbumInfo[];
}

// 已缓存的公众号信息
const cachedAccountInfos: AccountInfo[] = reactive(await getAllInfo());
cachedAccountInfos.forEach(async accountInfo => {
  accountInfo.albums = await getAllAlbums(accountInfo.fakeid);
});
const sortedAccountInfos = computed(() => {
  cachedAccountInfos.sort((a, b) => {
    if (a.albums && b.albums) {
      return a.albums.length > b.albums.length ? -1 : 1;
    } else {
      return 0;
    }
  });
  return cachedAccountInfos;
});

// 获取公众号下所有的合集数据（根据已缓存的文章数据）
async function getAllAlbums(fakeid: string) {
  const articles = await getArticleCache(fakeid, Math.floor(Date.now() / 1000));
  const albums: AppMsgAlbumInfo[] = [];
  articles
    .flatMap(article => article.appmsg_album_infos)
    .forEach(album => {
      if (!albums.some(a => a.id === album.id)) {
        albums.push(album);
      }
    });

  return albums;
}

const selected = defineModel<AccountInfo | undefined>();
</script>
