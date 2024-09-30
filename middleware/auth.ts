// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore(); // Accede a tu store de Pinia

  // Verifica si el usuario está autenticado
  if (!userStore.isAuthenticated()) {
    // Redirige a la página de inicio de sesión si no está autenticado
    return navigateTo("/login");
  }
});
