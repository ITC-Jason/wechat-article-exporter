<script setup lang="ts">
import CodeSegment from '~/components/api/CodeSegment.vue';

interface TParam {
  name: string;
  location: string;
  label: string;
  required: boolean;
  default: string;
  type: string;
  remark: string;
}

interface Props {
  index: number;
  name: string;
  description: string;
  url: string;
  method: string;
  params: TParam[];
  responseSample: any;
  remark?: string;
}
defineProps<Props>();

const open = ref(false);
const { t } = useLocale();

const host = window.location.protocol + '//' + window.location.host;
</script>

<template>
  <div class="space-y-5">
    <h2 class="flex items-center space-x-3 text-2xl font-semibold font-serif py-2">
      <span>{{ index }}. {{ name }}</span>
      <ApiDebugModal :initial-selected="name" />
    </h2>

    <div>
      <p class="font-semibold mb-2">{{ t('api.brief') }}</p>
      <p class="font-serif">{{ description }}</p>
    </div>
    <div v-if="remark">
      <p class="font-semibold mb-2">{{ t('api.remark') }}</p>
      <p class="text-rose-500">{{ remark }}</p>
    </div>
    <div>
      <p class="font-semibold mb-2">{{ t('api.requestUrl') }}</p>
      <p class="font-mono border p-2 rounded-md">
        <span class="text-gray-400">{{ host }}</span>
        <span class="font-semibold">{{ url }}</span>
      </p>
    </div>
    <div>
      <p class="font-semibold mb-2">{{ t('api.method') }}</p>
      <p class="font-mono border p-2 rounded-md">{{ method }}</p>
    </div>
    <div>
      <p class="font-semibold mb-2">{{ t('api.params') }}</p>
      <div class="border rounded-md overflow-hidden">
        <table class="font-mono">
          <thead>
            <tr>
              <th>{{ t('api.paramName') }}</th>
              <th>{{ t('api.paramLocation') }}</th>
              <th>{{ t('api.required') }}</th>
              <th>{{ t('api.defaultValue') }}</th>
              <th>{{ t('api.type') }}</th>
              <th>{{ t('api.description') }}</th>
              <th>{{ t('api.remark') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in params" :key="p.name">
              <td>{{ p.name }}</td>
              <td>{{ p.location }}</td>
              <td>{{ p.required ? t('common.yes') : t('common.no') }}</td>
              <td>{{ p.default }}</td>
              <td>{{ p.type }}</td>
              <td>{{ p.label }}</td>
              <td>{{ p.remark }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <p class="font-semibold flex items-center mb-2">
        <span class="mr-3">{{ t('api.responseSample') }}</span>
        <UToggle v-model="open" color="blue" on-icon="i-heroicons:eye" off-icon="i-heroicons:eye-slash" />
      </p>
      <CodeSegment v-if="open" :code="responseSample" lang="json" />
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #e5e7eb;
  padding: 8px;
  text-align: center;
}
thead {
  background-color: #00005506;
}
tr:nth-child(even) {
  background-color: #00005506;
}
</style>
