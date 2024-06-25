<template>
  <div class="card">
    <div :style="{ marginBottom: '10px' }">
      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="New"
            icon="pi pi-plus"
            severity="success"
            class="mr-2"
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
    >
      <Column expander style="width: 5rem" />
      <Column field="name" header="Name"></Column>
      <Column field="timeMeasured" header="Time Measured">
        <template #body="slotProps">
          {{ reformatDate(slotProps.data.timeMeasured) }}
        </template>
      </Column>
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
      <template #expansion="slotProps">
        <ul v-for="(value, key) in slotProps.data" :key="key">
          <li v-if="notCommonKey(key)">
            {{ reformatKey(key as any) }} : {{ value }}
          </li>
        </ul>
      </template>
    </DataTable>
  </div>
  <Dialog
    v-model:visible="editDialogVisible"
    modal
    header="Update Vital Sign"
    :style="{ width: '25rem' }"
  >
    <div class="flex-auto">
      <div>
        <label for="datepicker-24h" class="font-bold block mb-2">
          Time Measured
        </label>
      </div>
      <DatePicker
        :style="{ marginBottom: '10px' }"
        id="datepicker-24h"
        v-model="selectedVitalSign!.timeMeasured"
        showTime
        dateFormat="dd/mm/yy"
        hourFormat="24"
      />
      <div v-if="selectedVitalSign!.name === 'BLOOD_PRESSURE'">
        <div>
          <label for="systole" class="font-bold block mb-2"> Systole </label>
        </div>
        <input
          :style="{ marginBottom: '10px' }"
          id="systole"
          v-model="selectedVitalSign!.systole"
          type="number"
          class="p-inputtext p-component"
        />
        <div>
          <label for="diastole" class="font-bold block mb-2"> Diastole </label>
        </div>
        <input
          :style="{ marginBottom: '10px' }"
          id="diastole"
          v-model="selectedVitalSign!.diastole"
          type="number"
          class="p-inputtext p-component"
        />
      </div>
      <div v-if="selectedVitalSign!.name === 'BODY_TEMPERATURE'">
        <div>
          <label for="celcius" class="font-bold block mb-2">
            Temperature (C)
          </label>
        </div>
        <input
          :style="{ marginBottom: '10px' }"
          id="celcius"
          v-model="selectedVitalSign!.celcius"
          type="number"
          step="0.1"
          class="p-inputtext p-component"
        />
      </div>
      <div v-if="selectedVitalSign!.name === 'HEART_BEAT'">
        <div>
          <label for="beatsPerMinute" class="font-bold block mb-2">
            Beats Per Minute
          </label>
        </div>
        <input
          :style="{ marginBottom: '10px' }"
          id="beatsPerMinute"
          v-model="selectedVitalSign!.beatsPerMinute"
          type="number"
          class="p-inputtext p-component"
        />
      </div>
      <div v-if="selectedVitalSign!.name === 'RESPIRATORY_RATE'">
        <div>
          <label for="breathsPerMinute" class="font-bold block mb-2">
            Breaths Per Minute
          </label>
        </div>
        <input
          :style="{ marginBottom: '10px' }"
          id="breathsPerMinute"
          v-model="selectedVitalSign!.breathsPerMinute"
          type="number"
          class="p-inputtext p-component"
        />
      </div>
    </div>
    <div :style="{ display: 'flex', marginTop: '10px', gap: '15px' }">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="editDialogVisible = false"
      ></Button>
      <Button type="button" label="Save" @click="saveChanges"></Button>
    </div>
  </Dialog>
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
import Dialog from "primevue/dialog";
import DatePicker from "primevue/datepicker";

const vitalSigns = ref<VitalSign[]>([]);
const errorMessage = ref<string | null>(null);
const userStore = useUserStore();
const router = useRouter();
const editDialogVisible = ref(false);
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
  const resourceName = getResourceName(raw);

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

function handleEdit(vitalSign: VitalSign) {
  selectedVitalSign.value = { ...vitalSign };
  editDialogVisible.value = true;
}

async function saveChanges() {
  if (selectedVitalSign.value) {
    const raw = toRaw(selectedVitalSign.value);
    const resourceName = getResourceName(raw);

    try {
      const userId = userStore.userId;
      await axios.put(
        `http://localhost:3000/users/${userId}/${resourceName}/${raw.id}`,
        raw,
        { withCredentials: true }
      );
      editDialogVisible.value = false;
      vitalSigns.value = await fetchVitalSigns();
    } catch (error) {
      console.log(error);
    }
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
