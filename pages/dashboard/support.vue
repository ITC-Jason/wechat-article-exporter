<template>
  <div class="flex flex-col h-full">
    <Teleport defer to="#title">
      <h1 class="text-[28px] leading-[34px] text-slate-12 font-bold">{{ t('support.title') }}</h1>
    </Teleport>
    <div class="px-6 py-4 flex-1 overflow-scroll">
      <p class="text-rose-500 text-3xl mb-10 font-medium">
        {{ t('support.notice') }}<br />
        {{ t('support.noCrack') }}<br />
        {{ t('support.credentialHint') }}
      </p>

      <p class="my-5">
        {{ t('support.intro') }}
      </p>
      <ul class="space-y-2">
        <li>
          1)
          <span class="text-rose-400">{{ t('support.privateDeploy') }}</span
          >{{ t('support.privateDeployDesc') }}
        </li>
        <li>2) <span class="text-rose-400">{{ t('support.proxySetup') }}</span>{{ t('support.proxySetupDesc') }}</li>
        <li>
          3)
          <span class="text-rose-400">{{ t('support.oneOnOne') }}</span
          >{{ t('support.oneOnOneDesc') }}
        </li>
        <li>
          4) <span class="text-rose-400">{{ t('support.discount') }}</span>{{ t('support.discountDesc') }}
          <ExternalLink
            href="https://github.com/wechat-article/wechat-article-exporter/issues?q=is%3Aissue%20state%3Aopen%20label%3Apro%E8%AE%A1%E5%88%92"
            :text="t('support.paidService')"
          />{{ t('support.discountTail') }}
        </li>
      </ul>

      <div class="mt-5 pl-3 border-l-4 border-emerald-500">
        <h3 class="">{{ t('support.tips') }}</h3>
        <p class="">{{ t('support.tip1') }}</p>
        <p class="">{{ t('support.tip2') }}</p>
      </div>

      <img class="w-96" src="~/assets/wechat-support.png" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ExternalLink from '~/components/base/ExternalLink.vue';

const { t } = useLocale();

useHead({
  title: computed(() => `${t('support.title')} | ${t('site.name')}`),
});
</script>
