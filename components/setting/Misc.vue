<template>
  <UCard class="mx-4 mt-10 flex-1">
    <template #header>
      <h3 class="text-2xl font-semibold">{{ t('settings.misc.title') }}</h3>
    </template>

    <div class="flex">
      <div class="flex-1 flex flex-col space-y-3">
        <div class="flex gap-1">
          <UCheckbox v-model="preferences.hideDeleted" name="hideDeleted" :label="t('settings.misc.hideDeleted')" />
          <UPopover mode="hover" :popper="{ placement: 'top' }">
            <template #panel>
              <p class="max-w-[300px] p-3 text-sm text-gray-500">
                {{ t('settings.misc.hideDeletedHelp') }}
              </p>
            </template>
            <UIcon color="gray" name="i-heroicons:question-mark-circle-16-solid" class="size-5" />
          </UPopover>
        </div>

        <div class="flex gap-1">
          <UCheckbox
            v-model="preferences.downloadConfig.forceDownloadContent"
            name="forceDownloadContent"
            :label="t('settings.misc.forceDownload')"
          />
          <UPopover mode="hover" :popper="{ placement: 'top' }">
            <template #panel>
              <p class="max-w-[300px] p-3 text-sm text-gray-500">
                {{ t('settings.misc.forceDownloadHelp') }}
              </p>
            </template>
            <UIcon color="gray" name="i-heroicons:question-mark-circle-16-solid" class="size-5" />
          </UPopover>
        </div>

        <div class="flex gap-1">
          <UCheckbox
            v-model="preferences.downloadConfig.metadataOverrideContent"
            name="metadataOverrideContent"
            :label="t('settings.misc.metadataOverride')"
          />
          <UPopover mode="hover" :popper="{ placement: 'top' }">
            <template #panel>
              <p class="max-w-[300px] p-3 text-sm text-gray-500">
                {{ t('settings.misc.metadataOverrideHelp') }}
              </p>
            </template>
            <UIcon color="gray" name="i-heroicons:question-mark-circle-16-solid" class="size-5" />
          </UPopover>
        </div>
      </div>
      <div class="flex-1">
        <div>
          <p class="flex">
            <span class="text-sm">{{ t('settings.misc.syncFrequency') }}</span>
            <UPopover mode="hover" :popper="{ placement: 'top' }">
              <template #panel>
                <p class="max-w-[300px] p-3 text-sm text-gray-500">
                  {{ t('settings.misc.syncFrequencyHelp') }}
                </p>
              </template>
              <UIcon color="gray" name="i-heroicons:question-mark-circle-16-solid" class="size-5" />
            </UPopover>
          </p>
          <UInput
            type="number"
            v-model="preferences.accountSyncSeconds"
            :placeholder="t('settings.misc.syncFrequencyPlaceholder')"
            class="w-52 font-mono"
          >
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">{{ t('common.seconds') }}</span>
            </template>
          </UInput>
        </div>
      </div>
    </div>
    <div class="border border-slate-200 p-3 rounded-md mt-5">
      <p class="flex justify-between items-center mb-3">
        <span class="text-xl font-medium">
          {{ t('settings.misc.syncDateRange') }}
          <span class="text-xs text-slate-500">{{ t('settings.misc.syncDateRangeHint') }}</span>
        </span>
        <span class="text-sm text-blue-500 font-medium">
          {{ t('settings.misc.actualSyncRange', { range: getActualDateRange() }) }}
        </span>
      </p>

      <div class="flex gap-3">
        <USelectMenu
          class="w-1/2"
          v-model="preferences.syncDateRange"
          :options="DURATION_OPTIONS"
          value-attribute="value"
          option-attribute="label"
        />
        <UPopover v-if="preferences.syncDateRange === 'point'" :popper="{ placement: 'bottom-start' }">
          <UButton color="gray" icon="i-heroicons-calendar-days-20-solid" :label="formatDate()" />

          <template #panel="{ close }">
            <BaseDatePicker v-model="preferences.syncDatePoint" is-required @close="close" />
          </template>
        </UPopover>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import type { Preferences } from '~/types/preferences';

const { getActualDateRange, getSelectOptions } = useSyncDeadline();
const { t } = useLocale();

const preferences: Ref<Preferences> = usePreferences() as unknown as Ref<Preferences>;

const DURATION_OPTIONS = computed(() => getSelectOptions());

function formatDate() {
  return dayjs.unix(preferences.value.syncDatePoint).format('YYYY-MM-DD');
}
</script>
