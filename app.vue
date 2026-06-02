<template>
  <div :class="isDev ? 'debug-screens' : ''" class="flex flex-col h-screen">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <UModals />
  </div>
</template>

<script setup lang="ts">
import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule, LicenseManager } from 'ag-grid-enterprise';
import { isDev } from '~/config';
import { isChromeBrowser } from '~/utils';

const runtimeConfig = useRuntimeConfig();
const { t } = useLocale();

ModuleRegistry.registerModules([AllEnterpriseModule]);
LicenseManager.setLicenseKey(runtimeConfig.public.aggridLicense);

if (!isChromeBrowser()) {
  alert(t('site.chromeWarning'));
}
</script>

<style>
@import 'style.css';
</style>
