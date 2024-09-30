export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.pddvAPI;
  const userStore = useUserStore();

  return $fetch.create({
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${userStore.getToken()}`,
    },

    onResponseError: (context) => {
      const error = context.response._data;

      if (context.response.status === 401) {
        // Unauthorized
        userStore.logout();
        throw error;
      }
      throw error;
    },
  });
};
