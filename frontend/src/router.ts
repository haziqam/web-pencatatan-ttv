import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";

export const routes: RouteRecordRaw[] = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "login",
    path: "/login",
    component: Login,
  },
  {
    name: "register",
    path: "/register",
    component: Register,
  },
];
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
