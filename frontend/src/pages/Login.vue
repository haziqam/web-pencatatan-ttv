<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Login</h1>
          <p class="text-xs-center">
            <RouterLink to="/register"> Need an account? </RouterLink>
          </p>
          <form ref="formRef" aria-label="Login form" @submit.prevent="login">
            <fieldset class="form-group" aria-required="true">
              <div class="error-messages">
                {{ validationErrors.email }}
              </div>
              <input
                v-model="form.email"
                aria-label="Email"
                class="form-control form-control-lg"
                type="email"
                required
                placeholder="Email"
              />
            </fieldset>
            <fieldset class="form-group">
              <div class="error-messages">
                {{ validationErrors.password }}
              </div>
              <input
                v-model="form.password"
                aria-label="Password"
                class="form-control form-control-lg"
                type="password"
                required
                placeholder="Password"
              />
            </fieldset>
            <button
              class="btn btn-lg btn-primary pull-xs-right"
              :disabled="!form.email || !form.password"
              type="submit"
            >
              Sign in
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
import { LoginRequest, LoginResponse, loginSchema } from "src/types/authSchema";
import { useUserStore } from "src/store/UserStore";

const form: LoginRequest = reactive({
  email: "",
  password: "",
});

const validationErrors = ref<Partial<LoginRequest>>({});
const requestError = ref<string | null>(null);
const router = useRouter();

async function login() {
  try {
    validationErrors.value = {};
    requestError.value = null;

    loginSchema.parse(form);

    const response = await axios.post<LoginResponse>(
      "http://localhost:3000/users/auth/login",
      {
        email: form.email,
        password: form.password,
      }
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
      validationErrors.value = parseLoginErrors(JSON.parse(err.message));
    } else {
      requestError.value =
        "An unexpected error occurred. Please try again later.";
    }
  }
}

function parseLoginErrors(validationErrors: any[]): Partial<LoginRequest> {
  const result: Partial<LoginRequest> = {};

  validationErrors.forEach((error) => {
    const path = error.path[0];
    const message = error.message;

    if (path === "email" || path === "password") {
      result[path as keyof LoginRequest] = message;
    }
  });

  return result;
}
</script>
