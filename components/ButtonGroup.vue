<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
    <slot>
      <UButton color="white" :label="t('common.export')" trailing-icon="i-heroicons-chevron-down-20-solid" />
    </slot>
  </UDropdown>
</template>

<script setup lang="ts">
const emit = defineEmits();
const { t } = useLocale();

interface Item {
  label: string;
  event: string;
  disabled?: boolean;
}
interface Props {
  items: Item[];
}

const props = defineProps<Props>();

const items = [
  props.items.map(item => ({
    label: item.label,
    click() {
      emit(item.event);
    },
    disabled: item.disabled,
  })),
];
</script>
