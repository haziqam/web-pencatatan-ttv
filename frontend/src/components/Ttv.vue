<template>
  {{ vitalSigns }}
  {{ errorMessage }}
</template>

<script setup lang="ts">
import axios, { AxiosError } from "axios";
import { useUserStore } from "src/store/UserStore";
import { VitalSign } from "src/types/VitalSign";
import { VitalSignResponse } from "src/utils/vitalSignSchema";
import { ref } from "vue";
import { useRouter } from "vue-router";

const vitalSigns = ref<VitalSign[]>([]);
const errorMessage = ref<string | null>(null);

try {
  vitalSigns.value = await fetchVitalSigns();
} catch (error) {
  if (error instanceof AxiosError) {
    console.log(error.response);
    const status = error.response?.status;
    if (status === 403 || status === 401) {
      // show toast showing session expired
      const router = useRouter();
      router.push("/login");
    }
    errorMessage.value = (error.response?.data as VitalSignResponse).message;
  } else {
    errorMessage.value = (error as Error).message;
  }
}

async function fetchVitalSigns(): Promise<VitalSign[]> {
  const userStore = useUserStore();
  const userId = userStore.userId;
  const response = await axios.get<VitalSignResponse>(
    `http://localhost:3000/users/${userId}/vital-signs`,
    { withCredentials: true }
  );
  return response.data.data ?? [];
}
</script>
