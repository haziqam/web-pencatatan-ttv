<template>
  <Suspense>
    <template #fallback> Loading...</template>
    <template #default>
      <Ttv />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import Ttv from "src/components/Ttv.vue";
</script>
