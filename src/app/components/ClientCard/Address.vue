<template>
  <span class="inline-block">
    {{ address }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  client: LocalClient;
}>();

const globalStore = useGlobalStore();

const address = computed(() => {
  if (globalStore.information?.disableIpv6 || !props.client.ipv6Address) {
    return props.client.ipv4Address;
  }

  return `${props.client.ipv4Address}, ${props.client.ipv6Address}`;
});
</script>
