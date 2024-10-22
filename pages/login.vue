<script setup lang="ts">
const toast = useToast();
const router = useRouter();
const api = useApi();
const username = ref();
const password = ref();
const userState = useUserStore();
const isLoading = ref(false);

const iniciarSesion = async () => {
  try {
    if (username.value && password.value) {
      isLoading.value = true;
      toast.add({
        severity: "info",
        summary: "Iniciar Sesión",
        detail: "Cargando!",
        life: 3000,
      });
      await api("auth/login", {
        method: "POST",
        body: {
          username: username.value,
          password: password.value,
        },
      })
        .then((user) => {
          userState.setUser(user);
          router.push("/");
          toast.add({
            severity: "success",
            summary: "Iniciar Sesión",
            detail: "Bienvenido!",
            life: 3000,
          });
        })
        .catch((error) => {
          toast.add({
            severity: "warn",
            summary: "Iniciar Sesión",
            detail: error.message,
            life: 3000,
          });
        })
        .finally(() => {
          isLoading.value = false;
        });
    } else {
      toast.add({
        severity: "warn",
        summary: "Iniciar Sesión",
        detail: "Ingrese todos los datos!",
        life: 3000,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <div class="login">
    <div class="h-screen flex bg-primary justify-center items-center">
      <Card class="w-96 p-4">
        <template #title>
          <div class="flex flex-col items-center">
            <Avatar image="/img/logoSena.png" size="large" />
            <p>Proyecto decodificador de voz!</p>
          </div>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
            <IconField iconPosition="left">
              <InputIcon class="pi pi-at"> </InputIcon>
              <InputText placeholder="Usuario" v-model="username" />
            </IconField>
            <Password
              v-model="password"
              :feedback="false"
              placeholder="Contraseña"
              toggleMask
            />
          </div>
        </template>
        <template #footer>
          <div class="flex gap-3 mt-1">
            <Button
              :label="isLoading ? 'Cargando...' : 'Ingresar'"
              class="w-full"
              @click="iniciarSesion()"
              :disabled="isLoading"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style></style>
