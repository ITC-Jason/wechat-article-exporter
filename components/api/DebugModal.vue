<script setup lang="ts">
import type { FormError } from '#ui/types';
import CodeSegment from '~/components/api/CodeSegment.vue';
import { getApis } from '~/config/public-apis';

interface Props {
  initialSelected: string;
}
const props = defineProps<Props>();
const { t } = useLocale();
const apis = computed(() => getApis(t));

const isOpen = ref(false);
const selectedApi = ref(apis.value[0]);

const payload: Ref<Record<string, any>> = ref({});

const host = window.location.protocol + '//' + window.location.host;

function onOpen() {
  isOpen.value = true;
  selectedApi.value = apis.value.find(api => api.name === props.initialSelected) ?? apis.value[0];
}

function apiChange() {
  payload.value = {};
}

function isEmpty(key: string, obj: Record<string, any>): boolean {
  if (!obj.hasOwnProperty(key)) {
    return true;
  }
  let value = obj[key];
  if (typeof value === 'string') {
    value = value.trim();
  }
  return value === undefined || value === null || value === '';
}

function validate(state: Record<string, any>): FormError[] {
  const errors: FormError[] = [];

  selectedApi.value.params.forEach(param => {
    if (param.required && isEmpty(param.name, state)) {
      errors.push({ path: param.name, message: t('api.notEmpty', { name: param.name }) });
    }
    if (!isEmpty(param.name, state) && param.type === 'Int') {
      if (Number.isNaN(parseInt(state[param.name]))) {
        errors.push({ path: param.name, message: t('api.badFormat', { name: param.name }) });
      } else if (parseInt(state[param.name]) < 0) {
        errors.push({ path: param.name, message: t('api.minZero', { name: param.name }) });
      }
    }
  });

  return errors;
}

const resp = ref<Record<string, any> | null | string>(null);
const hasResponse = computed(() => {
  return typeof resp.value === 'string' || (typeof resp.value === 'object' && resp.value);
});
const btnLoading = ref(false);
function submit() {
  const params = toRaw(payload.value);

  let url = selectedApi.value.url;
  if (selectedApi.value.method === 'GET') {
    url += '?' + new URLSearchParams(params).toString();
  }

  btnLoading.value = true;
  resp.value = null;
  fetch(url, {
    method: selectedApi.value.method,
  })
    .then(resp => {
      if (resp.headers.get('content-type') === 'application/json') {
        return resp.json();
      } else {
        return resp.text();
      }
    })
    .then(data => {
      resp.value = data;
    })
    .finally(() => {
      btnLoading.value = false;
    });
}
</script>

<template>
  <div>
    <UTooltip :text="t('api.onlineDebug')" :popper="{ placement: 'top' }">
      <UButton color="blue" variant="ghost" square @click="onOpen" icon="i-lucide:bug-play"></UButton>
    </UTooltip>

    <USlideover v-model="isOpen" :ui="{ width: 'max-w-[800px]' }">
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          body: { base: 'overflow-y-scroll h-[calc(100vh-72px)]' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <h1 class="font-semibold text-2xl">{{ t('api.debugTitle') }}</h1>
        </template>

        <div class="space-y-5">
          <div class="flex items-center gap-3">
            <span>{{ t('api.selectApi') }}</span>
            <USelectMenu
              class="flex-1"
              v-model="selectedApi"
              :options="apis"
              option-attribute="name"
              @change="apiChange"
            >
              <template #label>
                <span
                  :class="[
                    selectedApi.method === 'GET' ? 'bg-green-400' : 'bg-fuchsia-400',
                    'inline-block size-2 flex-shrink-0 rounded-full',
                  ]"
                  aria-hidden="true"
                />
                <span class="font-medium">{{ selectedApi.name }}</span>
              </template>
              <template #option="{ option: api }">
                <div>
                  <p class="font-medium">
                    <span
                      :class="[
                        api.method === 'GET' ? 'bg-green-400' : 'bg-fuchsia-400',
                        'inline-block size-2 mr-2 flex-shrink-0 rounded-full',
                      ]"
                      aria-hidden="true"
                    />
                    <span>{{ api.name }}</span>
                  </p>
                  <p class="text-gray-400 font-mono">{{ api.description }}</p>
                </div>
              </template>
            </USelectMenu>
          </div>

          <div class="space-y-5">
            <div>
              <p class="font-semibold mb-2">{{ t('api.requestUrl') }}</p>
              <p class="font-mono border p-2 rounded-md">
                <span class="text-gray-400">{{ host }}</span>
                <span class="font-semibold">{{ selectedApi.url }}</span>
              </p>
            </div>
            <div>
              <p class="font-semibold mb-2">{{ t('api.method') }}</p>
              <p class="font-mono border p-2 rounded-md">{{ selectedApi.method }}</p>
            </div>
            <div>
              <p class="font-semibold mb-2">{{ t('api.params') }}</p>
              <UForm :state="payload" :validate="validate" @submit="submit" class="space-y-3">
                <UFormGroup
                  v-for="p in selectedApi.params"
                  :key="p.name"
                  :label="p.name"
                  :name="p.name"
                  :required="p.required"
                >
                  <UInput
                    v-model="payload[p.name]"
                    :type="p.type === 'Int' ? 'number' : 'text'"
                    :placeholder="p.label + (p.remark ? ', ' + p.remark : '')"
                  />
                </UFormGroup>
                <UButton type="submit" color="black" class="px-5" :loading="btnLoading">{{ t('common.submit') }}</UButton>
              </UForm>
            </div>
          </div>
          <div v-if="hasResponse">
            <h3 class="font-bold text-2xl">{{ t('common.response') }}</h3>
            <CodeSegment :code="resp!" :lang="typeof resp === 'object' ? 'json' : 'xml'" />
          </div>
        </div>
      </UCard>
    </USlideover>
  </div>
</template>
