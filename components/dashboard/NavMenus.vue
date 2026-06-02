<script setup lang="ts">
interface NavItem {
  name: string;
  icon: string;
  href: string;
  insider?: boolean;
  tags?: string[];
}

const items = ref<NavItem[]>([
  { name: 'dashboard.nav.account', icon: 'i-lucide:users', href: '/dashboard/account' },
  { name: 'dashboard.nav.article', icon: 'i-lucide:file-down', href: '/dashboard/article' },
  { name: 'dashboard.nav.single', icon: 'i-lucide:file-text', href: '/dashboard/single' },
  { name: 'dashboard.nav.album', icon: 'i-lucide:library-big', href: '/dashboard/album' },
  // { name: '公共代理', icon: 'i-lucide:globe', href: '/dashboard/proxy' },
  { name: 'API', icon: 'i-lucide:cable', href: '/dashboard/api' },
  { name: 'dashboard.nav.settings', icon: 'i-lucide:settings', href: '/dashboard/settings' },
  // { name: '技术支持 & 赞助', icon: 'i-lucide:heart-handshake', href: '/dashboard/support' },
]);

const { t } = useLocale();
</script>

<template>
  <nav class="flex-1 mt-6">
    <ul class="flex flex-col gap-2">
      <li v-for="item in items" :key="item.name">
        <NuxtLink :to="item.href" class="flex h-8 items-center gap-2 rounded-md px-2 text-sm nav-link">
          <UIcon :name="item.icon" class="size-5 opacity-80" />
          <p>{{ item.name === 'API' ? item.name : t(item.name) }}</p>
          <UBadge v-if="item.tags" v-for="tag in item.tags" color="fuchsia" variant="subtle">{{ tag }}</UBadge>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav-link.router-link-active {
  @apply text-slate-12 dark:text-slate-200 bg-slate-3 dark:bg-slate-800 font-bold;
}
.nav-link:not(.router-link-active) {
  @apply text-slate-11 dark:text-slate-200 hover:bg-slate-4 dark:hover:bg-slate-800 hover:text-slate-12;
}
</style>
