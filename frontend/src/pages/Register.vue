<template>
  <div class="auth-page">
    <div
      class="container page"
      :style="{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }"
    >
      <div
        class="card"
        :style="{
          backgroundColor: 'rgb(32, 32, 32)',
          borderRadius: '10px',
          padding: '40px',
          boxShadow: '5px 5px 20px 6px #315247',
        }"
      >
        <div :style="{ display: 'flex', justifyContent: 'center' }">
          <div>
            <div>
              <div>
                <h1
                  class="text-xs-center"
                  :style="{ color: 'white', fontWeight: 'bold' }"
                >
                  Register
                </h1>
                <p class="text-xs-center">
                  <RouterLink to="/login">
                    Already have an account?
                  </RouterLink>
                </p>
                <form
                  ref="formRef"
                  aria-label="Register form"
                  @submit.prevent="register"
                  :style="{ display: 'inline-block' }"
                >
                  <div :style="{ display: 'inline-block' }">
                    <fieldset class="form-group" aria-required="true">
                      <label class="form-label">Email</label>
                      <div class="error-messages">
                        {{ validationErrors.email }}
                      </div>
                      <InputText
                        v-model="form.email"
                        aria-label="Email"
                        :pt:root:style="{ width: '20rem' }"
                        type="email"
                        required
                        placeholder="Email"
                      />
                    </fieldset>
                    <fieldset class="form-group">
                      <label class="form-label">Password</label>
                      <div class="error-messages">
                        {{ validationErrors.password }}
                      </div>
                      <InputText
                        v-model="form.password"
                        aria-label="Password"
                        :pt:root:style="{ width: '20rem' }"
                        type="password"
                        required
                        placeholder="Password"
                      />
                    </fieldset>
                    <fieldset class="form-group">
                      <label class="form-label">First Name</label>
                      <div class="error-messages">
                        {{ validationErrors.firstName }}
                      </div>
                      <InputText
                        v-model="form.firstName"
                        aria-label="First Name"
                        :pt:root:style="{ width: '20rem' }"
                        type="text"
                        required
                        placeholder="First Name"
                      />
                    </fieldset>
                    <fieldset class="form-group">
                      <label class="form-label">Last Name</label>
                      <div class="error-messages">
                        {{ validationErrors.lastName }}
                      </div>
                      <InputText
                        v-model="form.lastName"
                        aria-label="Last Name"
                        :pt:root:style="{ width: '20rem' }"
                        type="text"
                        required
                        placeholder="Last Name"
                      />
                    </fieldset>
                    <fieldset class="form-group">
                      <label class="form-label">Date of Birth</label>
                      <div class="error-messages">
                        {{ validationErrors.dateOfBirth }}
                      </div>
                      <DatePicker
                        :pt:root:style="{ width: '20rem' }"
                        v-model="form.dateOfBirth"
                      />
                    </fieldset>
                    <fieldset class="form-group">
                      <label class="form-label">Sex</label>
                      <div class="error-messages">
                        {{ validationErrors.sex }}
                      </div>
                      <Select
                        v-model="form.sex"
                        aria-label="Sex"
                        :pt:root:style="{ width: '20rem' }"
                        required
                        :options="sexOptions"
                      />
                    </fieldset>
                    <Button
                      class="btn btn-lg btn-primary pull-xs-right"
                      :disabled="
                        !form.email ||
                        !form.password ||
                        !form.firstName ||
                        !form.lastName ||
                        !form.dateOfBirth ||
                        !form.sex
                      "
                      type="submit"
                    >
                      Sign up
                    </Button>
                    <div class="error-messages">
                      {{ requestError }}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import axios from "axios";
import { useRouter, RouterLink } from "vue-router";
import { ZodError, date } from "zod";
import {
  RegisterRequest,
  RegisterResponse,
  registerSchema,
} from "src/utils/authSchema";
import {
  ErrorMessage,
  parseValidationError,
} from "src/utils/parseValidationError";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import Button from "primevue/button";

const form: RegisterRequest = reactive({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  dateOfBirth: new Date(),
  sex: "MALE",
});

const sexOptions = ["MALE", "FEMALE"];
const validationErrors = ref<ErrorMessage<RegisterRequest>>({});
const requestError = ref<string | null>(null);
const router = useRouter();

async function register() {
  try {
    validationErrors.value = {};
    requestError.value = null;

    registerSchema.parse(form);

    const formToPost = {
      ...form,
      ["dateOfBirth"]: formatDateToYYYYMMDD(form.dateOfBirth),
    };

    const response = await axios.post<RegisterResponse>(
      "http://localhost:3000/users/auth/register",
      formToPost
    );

    router.push("/login");
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const responseData: RegisterResponse = err.response.data;
      requestError.value = `${responseData.message}. ${
        responseData.errors ?? ""
      }`;
    } else if (err instanceof ZodError) {
      validationErrors.value = parseValidationError(form, err.errors);
    } else {
      requestError.value =
        "An unexpected error occurred. Please try again later.";
    }
  }
}

function formatDateToYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
</script>
