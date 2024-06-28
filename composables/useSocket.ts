import io from "socket.io-client";

export const useSocket = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.pddvAPI;
  const userStore = useUserStore();

  const socket = io(baseURL, {
    extraHeaders: {
      authorization: `${userStore.getToken()}`,
    },
  });

  return socket;
};
