import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";
import { useUserStore } from "./store/UserStore";

export const routes: RouteRecordRaw[] = [
  {
    name: "home",
    path: "/",
    component: Home,
    beforeEnter: (_to, _from, next) => {
      const userStore = useUserStore();
      console.log(`userId in router:15 : ${userStore.userId}`);
      if (userStore.userId) {
        next();
      } else {
        next({ path: "/login" });
      }
    },
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
