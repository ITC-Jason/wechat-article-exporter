<template>
  <UCard class="mx-4 mt-10 flex-1">
    <template #header>
      <h3 class="text-2xl font-semibold">{{ t('settings.export.title') }}</h3>
      <p class="text-sm text-slate-10 font-serif">{{ t('settings.export.description') }}</p>
    </template>

    <div class="flex flex-col space-y-5">
      <div>
        <p class="mb-2">
          <span class="mr-3">{{ t('settings.export.dirname') }}</span>
          <span class="inline-block w-8">
            <UPopover mode="hover" :popper="{ placement: 'right' }">
              <UButton color="white" size="sm" trailing-icon="i-heroicons:variable-16-solid" />

              <template #panel>
                <div class="p-4">
                  <p class="my-2 text-sm text-gray-500">
                    {{ t('settings.export.varHint') }}
                    <code class="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">
                      ${YYYY}-${MM}-${DD}_${title}
                    </code>
                  </p>
                  <p class="my-2 font-medium">{{ t('settings.export.supportedVars') }}</p>
                  <table class="w-full border-collapse border">
                    <tbody>
                      <tr>
                        <th class="w-20">{{ t('settings.export.variable') }}</th>
                        <th class="w-32">{{ t('settings.export.meaning') }}</th>
                        <th class="w-20">{{ t('settings.export.variable') }}</th>
                        <th class="w-32">{{ t('settings.export.meaning') }}</th>
                      </tr>
                      <tr v-for="(item, idx) in variables" :key="idx">
                        <td class="text-center">{{ item[0].name }}</td>
                        <td class="text-center">{{ item[0].description }}</td>
                        <td class="text-center">{{ item[1].name }}</td>
                        <td class="text-center">{{ item[1].description }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </UPopover>
          </span>
        </p>
        <p class="text-sm mb-2 text-gray-500">{{ t('settings.export.affectFormats') }}</p>
        <UInput
          :placeholder="t('settings.export.dirnamePlaceholder')"
          class="w-[600px] font-mono"
          name="dirname"
          v-model="preferences.exportConfig.dirname"
        />
        <p class="mt-2 text-sm text-gray-500">
          <span class="mr-1">{{ t('settings.export.preview') }}</span>
          <span class="font-mono text-gray-700 dark:text-gray-300">{{ dirnamePreview }}</span>
        </p>
      </div>
      <div>
        <p class="mb-2 flex items-center gap-3">
          <span>{{ t('settings.export.maxLength') }}</span>
          <span class="text-xs text-gray-500">{{ t('settings.export.noLimit') }}</span>
          <UInput
            class=""
            :placeholder="t('settings.export.maxLengthPlaceholder')"
            v-model="preferences.exportConfig.maxlength"
            type="number"
            min="0"
          />
        </p>
      </div>
      <div>
        <UCheckbox
          v-model="preferences.exportConfig.exportExcelIncludeContent"
          name="exportExcelIncludeContent"
          :label="t('settings.export.includeExcelContent')"
        />
      </div>
      <div>
        <UCheckbox
          v-model="preferences.exportConfig.exportJsonIncludeContent"
          name="exportJsonIncludeContent"
          :label="t('settings.export.includeJsonContent')"
        />
        <UCheckbox
          v-model="preferences.exportConfig.exportJsonIncludeComments"
          name="exportJsonIncludeComments"
          :label="t('settings.export.includeJsonComments')"
        />
      </div>
      <div>
        <UCheckbox
          v-model="preferences.exportConfig.exportHtmlIncludeComments"
          name="exportHtmlIncludeComments"
          :label="t('settings.export.includeHtmlComments')"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Preferences } from '~/types/preferences';

const preferences: Ref<Preferences> = usePreferences() as unknown as Ref<Preferences>;
const { t } = useLocale();

const sampleData = computed<Record<string, string>>(() => ({
  account: t('settings.export.sampleAccount'),
  title: t('settings.export.sampleTitle'),
  aid: '100000001',
  author: t('settings.export.sampleAuthor'),
  YYYY: '2025',
  MM: '03',
  DD: '15',
  HH: '10',
  mm: '30',
}));

const dirnamePreview = computed(() => {
  let result = preferences.value.exportConfig.dirname || '';
  for (const [key, value] of Object.entries(sampleData.value)) {
    result = result.replace(new RegExp(`\\$\\{${key}}`, 'g'), value);
  }
  const maxlength = preferences.value.exportConfig.maxlength;
  if (maxlength) {
    result = result.slice(0, maxlength);
  }
  return result || t('common.empty');
});

const variables = computed(() => {
  const source = [
    { name: 'account', description: t('settings.export.varAccount') },
    { name: 'title', description: t('settings.export.varTitle') },
    { name: 'aid', description: t('settings.export.varAid') },
    { name: 'author', description: t('settings.export.varAuthor') },
    { name: 'YYYY', description: t('settings.export.varYear') },
    { name: 'MM', description: t('settings.export.varMonth') },
    { name: 'DD', description: t('settings.export.varDay') },
    { name: 'HH', description: t('settings.export.varHour') },
    { name: 'mm', description: t('settings.export.varMinute') },
  ];
  return Array.from({ length: Math.ceil(source.length / 2) }, (_, i) => [source[i * 2] ?? {}, source[i * 2 + 1] ?? {}]);
});
</script>

<style scoped>
table th {
  padding: 0.5rem 0.25rem;
}
table td {
  border: 1px solid #00002d17;
  padding: 0.25rem 0.5rem;
}

td:first-child,
th:first-child {
  border-left: none;
}

td:last-child,
th:last-child {
  border-right: none;
}

th {
  border: 1px solid #00002d17;
  border-top: none;
}

tr:nth-child(even) {
  background-color: #00005506;
}

tr:hover {
  background-color: #00005506;
}
</style>
