<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Register</h1>
          <p class="text-xs-center">
            <RouterLink to="/login"> Already have an account? </RouterLink>
          </p>
          <form
            ref="formRef"
            aria-label="Register form"
            @submit.prevent="register"
          >
            <fieldset class="form-group" aria-required="true">
              <label class="form-label">Email</label>
              <div class="error-messages">
                {{ validationErrors.email }}
              </div>
              <input
                v-model="form.email"
                aria-label="Email"
                class="form-control"
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
              <input
                v-model="form.password"
                aria-label="Password"
                class="form-control"
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
              <input
                v-model="form.firstName"
                aria-label="First Name"
                class="form-control"
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
              <input
                v-model="form.lastName"
                aria-label="Last Name"
                class="form-control"
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
              <input
                v-model="form.dateOfBirth"
                aria-label="Date of Birth"
                class="form-control"
                type="date"
                required
                placeholder="Date of Birth"
              />
            </fieldset>
            <fieldset class="form-group">
              <label class="form-label">Sex</label>
              <div class="error-messages">
                {{ validationErrors.sex }}
              </div>
              <select
                v-model="form.sex"
                aria-label="Sex"
                class="form-control"
                required
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </fieldset>
            <button
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
            </button>
            <div class="error-messages">
              {{ requestError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import axios from "axios";
import { useRouter, RouterLink } from "vue-router";
import { ZodError } from "zod";
import {
  RegisterRequest,
  RegisterResponse,
  registerSchema,
} from "src/utils/authSchema";
import {
  ErrorMessage,
  parseValidationError,
} from "src/utils/parseValidationError";

const form: RegisterRequest = reactive({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  sex: "MALE",
});

const validationErrors = ref<ErrorMessage<RegisterRequest>>({});
const requestError = ref<string | null>(null);
const router = useRouter();

async function register() {
  try {
    validationErrors.value = {};
    requestError.value = null;

    registerSchema.parse(form);

    const response = await axios.post<RegisterResponse>(
      "http://localhost:3000/users/auth/register",
      form
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
</script>
