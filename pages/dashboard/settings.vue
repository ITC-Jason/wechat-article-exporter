<template>
  <div class="h-full">
    <Teleport defer to="#title">
      <h1 class="text-[28px] leading-[34px] text-slate-12 dark:text-slate-50 font-bold">{{ t('settings.title') }}</h1>
    </Teleport>

    <div class="h-full overflow-scroll">
      <SettingProxy />
      <div class="flex flex-wrap">
        <SettingExport />
        <SettingMisc />
      </div>
      <!--      <div>-->
      <!--        <SettingDisplay />-->
      <!--      </div>-->
      <div class="h-[30vh]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useLocale();

useHead({
  title: computed(() => `${t('settings.title')} | ${t('site.name')}`),
});
</script>
