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
        <div>
          <div
            class="col-md-6 offset-md-3 col-xs-12"
            :style="{ display: 'flex', justifyContent: 'center' }"
          >
            <div>
              <h1
                class="text-xs-center"
                :style="{ color: 'white', fontWeight: 'bold' }"
              >
                Login
              </h1>
              <p class="text-xs-center">
                <RouterLink to="/register"> Need an account? </RouterLink>
              </p>
              <form
                ref="formRef"
                aria-label="Login form"
                @submit.prevent="login"
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
                      type="email"
                      required
                      placeholder="Email"
                      :pt:root:style="{ width: '20rem' }"
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
                      type="password"
                      required
                      placeholder="Password"
                      :pt:root:style="{ width: '20rem' }"
                    />
                  </fieldset>
                  <Button
                    :disabled="!form.email || !form.password"
                    type="submit"
                  >
                    Sign in
                  </Button>
                  <div class="error-messages" :style="{ marginTop: '15px' }">
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
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import axios from "axios";
import { useRouter, RouterLink } from "vue-router";
import { ZodError } from "zod";
import { LoginRequest, LoginResponse, loginSchema } from "src/utils/authSchema";
import { useUserStore } from "src/store/UserStore";
import {
  ErrorMessage,
  parseValidationError,
} from "src/utils/parseValidationError";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const form: LoginRequest = reactive({
  email: "",
  password: "",
});

const validationErrors = ref<ErrorMessage<LoginRequest>>({});
const requestError = ref<string | null>(null);
const router = useRouter();

async function login() {
  try {
    validationErrors.value = {};
    requestError.value = null;

    loginSchema.parse(form);

    const response = await axios.post<LoginResponse>(
      "http://localhost:3000/users/auth/login",
      form,
      { withCredentials: true }
    );

    const userStore = useUserStore();
    userStore.setUserId(response.data.data?.id!);

    router.push("/");
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const responseData: LoginResponse = err.response.data;
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
