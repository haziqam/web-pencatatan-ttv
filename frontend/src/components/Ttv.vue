<template>
  <Toast />
  <h1 class="text-xs-center" :style="{ color: 'white', fontWeight: 'bold' }">
    Vital Sign Tracker
  </h1>
  <p class="text-xs-center" :style="{ color: 'white' }">
    By: Haziq Abiyyu Mahdy
  </p>
  <div class="card" :style="{ backgroundColor: 'rgb(64, 64, 64)' }">
    <div :style="{ marginBottom: '10px' }">
      <Toolbar
        class="mb-6"
        :pt:root:style="{ boxShadow: '5px 5px 20px 6px #315247' }"
      >
        <template #start>
          <Button
            label="New"
            icon="pi pi-plus"
            severity="success"
            class="mr-2"
            @click="newDialogVisible = true"
          />
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
    </div>
    <DataTable
      :value="vitalSigns"
      v-model:expandedRows="expandedRows"
      @rowExpand="onExpandRow"
      tableStyle="min-width: 50rem"
      dataKey="id"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :pt:root:style="{
        boxShadow: '5px 5px 20px 6px #315247',
      }"
    >
      <Column expander style="width: 5rem" />
      <Column field="name" header="Name"></Column>
      <Column field="timeMeasured" header="Time Measured">
        <template #body="slotProps">
          {{ reformatDate(slotProps.data.timeMeasured) }}
        </template>
      </Column>
      <Column field="status" header="Status"></Column>
      <Column header="Action" :exportable="false">
        <template #body="slotProps">
          <div :style="{ display: 'flex', gap: '10px' }">
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
          </div>
        </template>
      </Column>
      <template #expansion="slotProps">
        <ul v-for="(value, key) in slotProps.data" :key="key">
          <li v-if="notCommonKey(key)">
            {{ reformatKey(key as any) }} : {{ value }}
          </li>
        </ul>
      </template>
    </DataTable>
  </div>
  <VitalSignDialog
    :vitalSign="selectedVitalSign"
    :dialogVisible="editDialogVisible"
    @update:dialogVisible="editDialogVisible = $event"
    @submit="saveChanges"
  />
  <VitalSignDialog
    :vitalSign="null"
    :dialogVisible="newDialogVisible"
    @update:dialogVisible="newDialogVisible = $event"
    @submit="createNew"
  />
</template>

<script setup lang="ts">
import { AxiosError } from "axios";
import axiosInstance from "src/axios/axiosInstance";
import { useUserStore } from "src/store/UserStore";
import { VitalSign } from "src/types/VitalSign";
import { VitalSignResponse } from "src/utils/vitalSignSchema";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import VitalSignDialog from "src/components/VitalSignDialog.vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { showSuccess } from "src/utils/toast";

const toast = useToast();
const vitalSigns = ref<VitalSign[]>([]);
const errorMessage = ref<string | null>(null);
const userStore = useUserStore();
const router = useRouter();
const editDialogVisible = ref(false);
const newDialogVisible = ref(false);
const expandedRows = ref<{ [key: string]: boolean }>({});
const selectedVitalSign = ref<VitalSign | null>(null);

try {
  vitalSigns.value = await fetchVitalSigns();
} catch (error) {
  if (error instanceof AxiosError) {
    console.log(error.response);
    const status = error.response?.status;
    if (status === 403 || status === 401) {
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
  const response = await axiosInstance.get<VitalSignResponse>(
    `http://localhost:3000/users/${userId}/vital-signs`,
    { withCredentials: true }
  );
  return response.data.data ?? [];
}

async function logout(): Promise<void> {
  try {
    await axiosInstance.post(
      `http://localhost:3000/users/auth/logout`,
      undefined,
      {
        withCredentials: true,
      }
    );
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
  const resourceName = getResourceName(raw);

  try {
    const userId = userStore.userId;
    const response = await axiosInstance.delete(
      `http://localhost:3000/users/${userId}/${resourceName}/${raw.id}`,
      { withCredentials: true }
    );
    showSuccess(toast, "Vital sign data deleted successfully");
  } catch (error) {
    console.log(error);
  } finally {
    vitalSigns.value = await fetchVitalSigns();
  }
}

function handleEdit(vitalSign: VitalSign) {
  selectedVitalSign.value = { ...vitalSign };
  editDialogVisible.value = true;
}

async function saveChanges(vitalSign: VitalSign) {
  const raw = toRaw(vitalSign);
  const resourceName = getResourceName(raw);

  try {
    const userId = userStore.userId;
    await axiosInstance.put(
      `http://localhost:3000/users/${userId}/${resourceName}/${raw.id}`,
      raw,
      { withCredentials: true }
    );
    editDialogVisible.value = false;
    vitalSigns.value = await fetchVitalSigns();
    showSuccess(toast, "Vital sign data edited successfully");
  } catch (error) {
    console.log(error);
  }
}

async function createNew(vitalSign: VitalSign) {
  const raw = toRaw(vitalSign);
  const resourceName = getResourceName(raw);

  try {
    const userId = userStore.userId;
    await axiosInstance.post(
      `http://localhost:3000/users/${userId}/${resourceName}`,
      raw,
      { withCredentials: true }
    );
    newDialogVisible.value = false;
    vitalSigns.value = await fetchVitalSigns();
    showSuccess(toast, "Vital sign data stored successfully");
  } catch (error) {
    console.log(error);
  }
}

function reformatDate(stringDate: string) {
  const date = new Date(stringDate);
  return date.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" });
}

function onExpandRow(id: string) {
  if (id in expandedRows) delete expandedRows.value[id];
  else expandedRows.value[id] = true;
}

function notCommonKey(key: any) {
  const common = ["id", "name", "timeMeasured", "userId", "status"];
  return !common.includes(key);
}

function reformatKey(key: vitalSignKey) {
  const dict = {
    celcius: "Temperature (C)",
    beatsPerMinute: "Beats Per Minute",
    breathsPerMinute: "Breaths Per Minute",
    systole: "Systole",
    diastole: "Diastole",
  };
  return dict[key];
}

type vitalSignKey =
  | "celcius"
  | "beatsPerMinute"
  | "breathsPerMinute"
  | "systole"
  | "diastole";

function getResourceName(vitalSign: VitalSign): string {
  return vitalSign.name == "BLOOD_PRESSURE"
    ? "blood-pressures"
    : vitalSign.name == "BODY_TEMPERATURE"
    ? "body-temperatures"
    : vitalSign.name == "HEART_BEAT"
    ? "heart-beats"
    : "respiratory-rates";
}
</script>
