<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Login</h1>
          <p class="text-xs-center">
            <RouterLink to="/register"> Need an account? </RouterLink>
          </p>

          <ul class="error-messages">
            <li v-for="(error, field) in errors" :key="field">
              {{ field }} {{ error ? error[0] : "" }}
            </li>
          </ul>

          <form ref="formRef" aria-label="Login form" @submit.prevent="login">
            <fieldset class="form-group" aria-required="true">
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

interface LoginUser {
  email: string;
  password: string;
}

const formRef = ref<HTMLFormElement | null>(null);
const form: LoginUser = reactive({
  email: "",
  password: "",
});

const errors = ref<{ [key: string]: string[] | null }>({});
const router = useRouter();

async function login() {
  try {
    errors.value = {};
    const response = await axios.post(
      "http://localhost:3000/users/auth/login",
      {
        email: form.email,
        password: form.password,
      },
    );

    console.log("Login successful", response.data);
    router.push("/");
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      // Handle errors from the server
      const serverErrors = err.response.data.errors;
      errors.value = serverErrors
        ? serverErrors
        : { general: ["Invalid email or password"] };
    } else {
      // Handle unexpected errors
      errors.value = {
        general: ["An unexpected error occurred. Please try again later."],
      };
    }
  }
}
</script>
