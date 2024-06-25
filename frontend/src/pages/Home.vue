<template>
  <div
    :style="{ display: 'flex', justifyContent: 'center', marginTop: '30px' }"
  >
    <div :style="{ width: '90%' }">
      <Suspense>
        <template #fallback> Loading...</template>
        <template #default>
          <Ttv />
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup lang="ts">
import Ttv from "src/components/Ttv.vue";
</script>
