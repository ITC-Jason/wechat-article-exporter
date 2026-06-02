<template>
  <UCard class="mx-4 mt-10 flex-1">
    <template #header>
      <h3 class="text-2xl font-semibold">{{ t('settings.display.title') }}</h3>
      <p class="text-sm text-slate-10 font-serif">{{ t('settings.display.description') }}</p>
    </template>

    <div class="flex flex-col space-y-5"></div>
  </UCard>
</template>

<script setup lang="ts">
const { t } = useLocale();
</script>
