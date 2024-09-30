import { useRouter } from "vue-router";

type User = {
  _id: string;
  username: string;
  access_token: string;
  rol: string;
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
      let path;
      switch (user.rol) {
        case "Root":
          path = "/admin/admin";
          break;

        case "Admin":
          path = "/admin/competencias";
          break;

        case "Instructor":
          path = "/admin/salas";
          break;

        case "Aprendiz":
          path = "/admin/salas";
          break;
      }
      const router = useRouter();
      router.push({
        path,
      });
    },
    getUser() {
      return this.user;
    },
    getToken() {
      return this.user?.access_token;
    },
    isAuthenticated() {
      if (this.user) {
        return true;
      }
      return false;
    },
    logout() {
      this.user = null; // Limpia el estado del usuario

      // Solo en el cliente
      if (import.meta.client) {
        localStorage.removeItem("useUserStore"); // Limpia la persistencia
      }

      const router = useRouter();
      router.push({
        path: "/login", // Redirige al login
      });
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});
