type User = {
  _id: string;
  username: string;
  access_token: string;
};

interface UserState {
  user: User | null;
}

export const useUserStore = defineStore("useUserStore", {
  state: (): UserState => ({
    user: null,
  }),
  actions: {
    setUser(user: any) {
      this.user = user;
      const router = useRouter();
      router.push({
        path: "/",
      });
    },
    getUser() {
      return this.user;
    },
    getToken() {
      return this.user?.access_token;
    },
    isAuthenticated(): boolean {
      if (this.user) {
        return true;
      }
      return false;
    },
    logout() {
      this.user = null;
      const router = useRouter();
      router.push({
        path: "/login",
      });
    },
  },
  persist: {
    storage: persistedState.cookies,
  },
});
