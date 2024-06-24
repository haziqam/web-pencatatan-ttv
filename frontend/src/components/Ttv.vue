<template>
  <div class="card">
    <Toolbar class="mb-6">
      <template #start>
        <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" />
      </template>

      <template #end>
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          severity="danger"
          class="mr-2"
          @click="logout"
        />
      </template>
    </Toolbar>
    <DataTable :value="vitalSigns" tableStyle="min-width: 50rem" dataKey="id">
      <Column field="name" header="Name"></Column>
      <Column field="timeMeasured" header="Time Measured"></Column>
      <Column field="status" header="Status"></Column>
      <Column header="Action" :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            class="mr-2"
            @click="handleEdit(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="handleDelete(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import axios, { AxiosError } from "axios";
import { useUserStore } from "src/store/UserStore";
import { VitalSign } from "src/types/VitalSign";
import { VitalSignResponse } from "src/utils/vitalSignSchema";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";

const vitalSigns = ref<VitalSign[]>([]);
const errorMessage = ref<string | null>(null);
const userStore = useUserStore();
const router = useRouter();

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
  const userId = userStore.userId;
  const response = await axios.get<VitalSignResponse>(
    `http://localhost:3000/users/${userId}/vital-signs`,
    { withCredentials: true }
  );
  return response.data.data ?? [];
}

async function logout(): Promise<void> {
  try {
    await axios.post(`http://localhost:3000/users/auth/logout`, undefined, {
      withCredentials: true,
    });
  } catch (error) {
    console.log(error);
  } finally {
    const userStore = useUserStore();
    userStore.removeUserId();
    router.push("/login");
  }
}

async function handleDelete(vitalSign: VitalSign): Promise<void> {
  const raw = toRaw(vitalSign);
  const resourceName =
    raw.name == "BLOOD_PRESSURE"
      ? "blood-pressures"
      : raw.name == "BODY_TEMPERATURE"
      ? "body-temperatures"
      : raw.name == "HEART_BEAT"
      ? "heart-beats"
      : "respiratory-rates";

  try {
    const userId = userStore.userId;
    const response = await axios.delete(
      `http://localhost:3000/users/${userId}/${resourceName}/${raw.id}`,
      { withCredentials: true }
    );
  } catch (error) {
    console.log(error);
  } finally {
    vitalSigns.value = await fetchVitalSigns();
  }
}

async function handleEdit(vitalSign: VitalSign): Promise<void> {
  console.log(toRaw(vitalSign));
}
</script>
