<script setup lang="ts">
const { t } = useLocale();
</script>

<template>
  <p class="flex flex-col items-center text-lg gap-2">
    <UIcon name="i-humbleicons:coffee" class="size-10" />
    <span class="font-bold font-serif">{{ t('common.noData') }}</span>
  </p>
</template>
