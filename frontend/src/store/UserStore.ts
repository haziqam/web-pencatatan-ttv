import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userId: undefined as string | undefined,
  }),
  actions: {
    setUserId(userId: string) {
      this.userId = userId;
    },
    removeUserId() {
      this.userId = undefined;
    },
  },
  persist: true,
});
