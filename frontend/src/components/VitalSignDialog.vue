<template>
  <Dialog
    :visible="dialogVisible"
    @update:visible="emitUpdateDialogVisible"
    modal
    :header="isNew ? 'Create New Vital Sign' : 'Update Vital Sign'"
    :style="{ width: '25rem' }"
  >
    <div class="flex-auto">
      <div v-if="isNew">
        <div>
          <label for="vitalSignName" class="font-bold block mb-2">
            Vital Sign Name
          </label>
        </div>
        <Select
          v-model="localVitalSign.name"
          :options="vitalSignOptions"
          optionValue="value"
          optionLabel="label"
          placeholder="Select a Vital Sign"
          class="w-full mb-6"
        />
      </div>
      <div>
        <label for="datepicker-24h" class="font-bold block mb-2">
          Time Measured
        </label>
      </div>
      <DatePicker
        :style="{ marginBottom: '10px' }"
        id="datepicker-24h"
        v-model="localVitalSign.timeMeasured"
        showTime
        dateFormat="dd/mm/yy"
        hourFormat="24"
      />
      <!-- Other input fields based on selected vital sign -->
      <div v-if="localVitalSign.name === 'BLOOD_PRESSURE'">
        <div>
          <label for="systole" class="font-bold block mb-2"> Systole </label>
        </div>
        <input
          :style="{ marginBottom: '10px' }"
          id="systole"
          v-model="localVitalSign.systole"
          type="number"
          class="p-inputtext p-component"
        />
        <div>
          <label for="diastole" class="font-bold block mb-2"> Diastole </label>
        </div>
        <input
          :style="{ marginBottom: '10px' }"
          id="diastole"
          v-model="localVitalSign.diastole"
          type="number"
          class="p-inputtext p-component"
        />
      </div>
      <div v-if="localVitalSign.name === 'BODY_TEMPERATURE'">
        <div>
          <label for="celcius" class="font-bold block mb-2">
            Temperature (C)
          </label>
        </div>
        <input
          :style="{ marginBottom: '10px' }"
          id="celcius"
          v-model="localVitalSign.celcius"
          type="number"
          step="0.1"
          class="p-inputtext p-component"
        />
      </div>
      <div v-if="localVitalSign.name === 'HEART_BEAT'">
        <div>
          <label for="beatsPerMinute" class="font-bold block mb-2">
            Beats Per Minute
          </label>
        </div>
        <input
          :style="{ marginBottom: '10px' }"
          id="beatsPerMinute"
          v-model="localVitalSign.beatsPerMinute"
          type="number"
          class="p-inputtext p-component"
        />
      </div>
      <div v-if="localVitalSign.name === 'RESPIRATORY_RATE'">
        <div>
          <label for="breathsPerMinute" class="font-bold block mb-2">
            Breaths Per Minute
          </label>
        </div>
        <input
          :style="{ marginBottom: '10px' }"
          id="breathsPerMinute"
          v-model="localVitalSign.breathsPerMinute"
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
        @click="cancelEdit"
      ></Button>
      <Button type="button" label="Save" @click="submitEdit"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, watch } from "vue";
import DatePicker from "primevue/datepicker";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import { VitalSign } from "src/types/VitalSign";

const props = defineProps<{
  vitalSign: VitalSign | null;
  dialogVisible: boolean;
}>();

const emits = defineEmits(["update:dialogVisible", "submit"]);

const localVitalSign = reactive<VitalSign>({
  name: "BLOOD_PRESSURE",
  timeMeasured: new Date().toISOString(),
  userId: "",
  status: "NORMAL",
} as VitalSign);

const vitalSignOptions = [
  { value: "BLOOD_PRESSURE", label: "Blood Pressure" },
  { value: "BODY_TEMPERATURE", label: "Body Temperature" },
  { value: "HEART_BEAT", label: "Heart Beat" },
  { value: "RESPIRATORY_RATE", label: "Respiratory Rate" },
];

let isNew = true;

watch(
  () => props.vitalSign,
  (newVal) => {
    if (newVal) {
      isNew = false;
      Object.assign(localVitalSign, newVal);
    } else {
      isNew = true;
      resetLocalVitalSign();
    }
  },
  { immediate: true }
);

function resetLocalVitalSign() {
  localVitalSign.name = "BLOOD_PRESSURE";
  localVitalSign.timeMeasured = new Date().toISOString();
  localVitalSign.userId = "";
  localVitalSign.status = "NORMAL";
}

function submitEdit() {
  emits("submit", localVitalSign);
}

function cancelEdit() {
  emits("update:dialogVisible", false);
}

function emitUpdateDialogVisible(value: boolean) {
  emits("update:dialogVisible", value);
}
</script>
