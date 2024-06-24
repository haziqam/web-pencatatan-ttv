<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Register</h1>
          <p class="text-xs-center">
            <RouterLink to="/login"> Have an account? </RouterLink>
          </p>

          <ul class="error-messages">
            <li v-for="(error, field) in errors" :key="field">
              {{ field }} {{ error ? error[0] : "" }}
            </li>
          </ul>

          <form
            ref="formRef"
            aria-label="Registration form"
            @submit.prevent="register"
          >
            <fieldset class="form-group">
              <input
                v-model="form.username"
                aria-label="Username"
                class="form-control form-control-lg"
                type="text"
                required
                placeholder="Your Name"
              />
            </fieldset>
            <fieldset class="form-group">
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
                :minLength="8"
                required
                placeholder="Password"
              />
            </fieldset>
            <button
              type="submit"
              class="btn btn-lg btn-primary pull-xs-right"
              :disabled="!(form.email && form.username && form.password)"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { NewUser } from "src/services/api";
import { RouterLink } from "vue-router";

const formRef = ref<HTMLFormElement | null>(null);
const form: NewUser = reactive({
  username: "",
  email: "",
  password: "",
});

const errors = ref();

async function register() {
  console.log("register...");
  console.log(form);
}
</script>
