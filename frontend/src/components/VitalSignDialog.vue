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
          :style="{ width: '80%' }"
        />
      </div>
      <div>
        <label for="datepicker-24h" class="font-bold block mb-2">
          Time Measured
        </label>
      </div>
      <DatePicker
        :style="{ marginBottom: '10px', width: '80%' }"
        id="datepicker-24h"
        v-model="localVitalSign.timeMeasured"
        showTime
        dateFormat="dd/mm/yy"
        hourFormat="24"
      />
      <div v-if="localVitalSign.name === 'BLOOD_PRESSURE'">
        <div>
          <label for="systole" class="font-bold block mb-2"> Systole </label>
        </div>
        <InputText
          :style="{ marginBottom: '10px', width: '80%' }"
          id="systole"
          v-model="localVitalSign.systole"
          type="number"
        />
        <div>
          <label for="diastole" class="font-bold block mb-2"> Diastole </label>
        </div>
        <InputText
          :style="{ marginBottom: '10px', width: '80%' }"
          id="diastole"
          v-model="localVitalSign.diastole"
          type="number"
        />
      </div>
      <div v-if="localVitalSign.name === 'BODY_TEMPERATURE'">
        <div>
          <label for="celcius" class="font-bold block mb-2">
            Temperature (C)
          </label>
        </div>
        <InputText
          :style="{ marginBottom: '10px', width: '80%' }"
          id="celcius"
          v-model="localVitalSign.celcius"
          type="number"
          step="0.1"
        />
      </div>
      <div v-if="localVitalSign.name === 'HEART_BEAT'">
        <div>
          <label for="beatsPerMinute" class="font-bold block mb-2">
            Beats Per Minute
          </label>
        </div>
        <InputText
          :style="{ marginBottom: '10px', width: '80%' }"
          id="beatsPerMinute"
          v-model="localVitalSign.beatsPerMinute"
          type="number"
        />
      </div>
      <div v-if="localVitalSign.name === 'RESPIRATORY_RATE'">
        <div>
          <label for="breathsPerMinute" class="font-bold block mb-2">
            Breaths Per Minute
          </label>
        </div>
        <InputText
          :style="{ marginBottom: '10px', width: '80%' }"
          id="breathsPerMinute"
          v-model="localVitalSign.breathsPerMinute"
          type="number"
        />
      </div>
    </div>
    <div :style="{ display: 'flex', marginTop: '10px', gap: '15px' }">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="cancel"
      ></Button>
      <Button
        type="button"
        label="Save"
        @click="submit"
        :disabled="!areFieldsFilled"
      ></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, watch, computed } from "vue";
import DatePicker from "primevue/datepicker";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import InputText from "primevue/inputtext";
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
  () => props.dialogVisible,
  (newVal) => {
    if (newVal) {
      if (!props.vitalSign) {
        isNew = true;
        resetLocalVitalSign();
      } else {
        isNew = false;
        Object.assign(localVitalSign, props.vitalSign);
      }
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

function submit() {
  emits("submit", localVitalSign);
}

function cancel() {
  emits("update:dialogVisible", false);
}

function emitUpdateDialogVisible(value: boolean) {
  emits("update:dialogVisible", value);
}

const areFieldsFilled = computed(() => {
  if (
    localVitalSign.timeMeasured == undefined ||
    localVitalSign.name == undefined
  )
    return false;

  switch (localVitalSign.name) {
    case "BLOOD_PRESSURE":
      return (
        localVitalSign.systole != undefined &&
        localVitalSign.diastole != undefined
      );
    case "BODY_TEMPERATURE":
      return localVitalSign.celcius != undefined;
    case "HEART_BEAT":
      return localVitalSign.beatsPerMinute != undefined;
    case "RESPIRATORY_RATE":
      return localVitalSign.breathsPerMinute != undefined;
  }
});
</script>
