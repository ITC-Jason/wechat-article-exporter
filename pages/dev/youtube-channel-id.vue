<template>
  <div class="p-2 mx-auto container">
    <p class="flex justify-between">
      <span>{{ t('dev.youtube.channelUrl') }}</span>
      <UBadge>{{ t('dev.youtube.validUrl', { count: validURLs.length }) }}</UBadge>
    </p>
    <UTextarea class="my-2" v-model="url" :placeholder="t('dev.youtube.urlPlaceholder')" autoresize />
    <UButton class="px-5" @click="submit" :loading="btnLoading" :disabled="validURLs.length === 0">{{
      btnLoading ? t('dev.youtube.extracting') : t('dev.youtube.extract')
    }}</UButton>

    <p class="mt-10 flex justify-between">
      <span>{{ t('dev.youtube.result') }}</span>
      <UBadge>{{ t('dev.youtube.validChannelId', { count: channelIDs.length }) }}</UBadge>
    </p>
    <UTextarea class="pb-5 my-2" v-model="channelID" :placeholder="t('dev.youtube.resultPlaceholder')" readonly autoresize />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const url = ref('');
const channelID = ref('');
const btnLoading = ref(false);
const { t } = useLocale();

const validURLs = computed(() => {
  return url.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('https://www.youtube.com/'));
});
const channelIDs = computed(() => {
  return channelID.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line);
});

async function submit() {
  channelID.value = '';
  btnLoading.value = true;

  for (const url of validURLs.value) {
    const channelId = await extractChannelID(url);
    if (channelId) {
      channelID.value += channelId + '\n';
    }
  }
  btnLoading.value = false;
}

async function extractChannelID(url: string): Promise<string | null> {
  const html = await fetch('https://lingering-haze-9880.sonaliyadav.workers.dev/?url=' + url).then(res => res.text());
  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/html');
  const meta = document.querySelector('meta[property="og:url"]');
  if (!meta) {
    return null;
  }
  const content = meta.getAttribute('content');
  if (!content) {
    return null;
  }
  return content.replace(/^https:\/\/www\.youtube\.com\/channel\//, '');
}
</script>
