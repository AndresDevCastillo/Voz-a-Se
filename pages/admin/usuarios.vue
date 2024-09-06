<script setup>
definePageMeta({
  layout: "admin",
});

// Dependencias
const api = useApi();
const confirm = useConfirm();
const toast = useToast();

const roles = ["Instructor", "Aprendiz"];

const users = ref([]);

const dialogCreateUser = ref(false);
const createUser = ref({
  username: null,
  password: null,
  rol: null,
});

const validCreateUser = computed(() => {
  const username = createUser.value.username;
  const password = createUser.value.password;
  const rol = createUser.value.rol;

  // Verifica si el username no es nulo y tiene al menos 3 caracteres
  const isValidUsername = username && username.length >= 3;

  // Verifica si la contraseña cumple con los requisitos
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumeric = /[0-9]/.test(password);
  const hasMinimumLength = password && password.length >= 8;

  // Devuelve true si tanto el username como la contraseña son válidos
  return (
    isValidUsername &&
    rol &&
    hasLowercase &&
    hasUppercase &&
    hasNumeric &&
    hasMinimumLength
  );
});

const getUsers = async () => {
  try {
    users.value = await api("/users");
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "danger",
      summary: "Obtener usuarios",
      detail: "Ocurrio un problema!",
      life: 3000,
    });
  }
};

const createUserDb = () => {
  confirm.require({
    message: "Estas seguro de crear al usuario " + createUser.value.username,
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancelar",
    acceptLabel: "Crear",
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-success",
    accept: async () => {
      try {
        const body = createUser.value;
        await api("/users", {
          method: "POST",
          body,
        });
        dialogCreateUser.value = false;
        await getUsers();
        toast.add({
          severity: "success",
          summary: "Crear Usuario",
          detail: "Usuario creado correctamente",
          life: 3000,
        });
        createUser.value = {
          username: null,
          password: null,
          rol: null,
        };
      } catch (error) {
        console.log(error);
        toast.add({
          severity: "danger",
          summary: "Crear Usuario",
          detail: "Ocurrio un problema!",
          life: 3000,
        });
      }
    },
  });
};

const deleteUser = (id, username) => {
  confirm.require({
    message: "Estas seguro de eliminar a" + username,
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancelar",
    acceptLabel: "Crear",
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        const body = createUser.value;
        await api("/users/" + id, {
          method: "DELETE",
          body,
        });
        dialogCreateUser.value = false;
        await getUsers();
        toast.add({
          severity: "success",
          summary: "Eliminar Usuario",
          detail: "Usuario Eliminado correctamente",
          life: 3000,
        });
      } catch (error) {
        console.log(error);
        toast.add({
          severity: "danger",
          summary: "Crear Usuario",
          detail: "Ocurrio un problema!",
          life: 3000,
        });
      }
    },
  });
};

await getUsers();
</script>

<template>
  <div class="m-5">
    <Toolbar class="mb-6">
      <template #start>
        <h2 class="text-2xl pl-2 my-2 font-sans">
          <i class="pi pi-user-edit" style="font-size: 1.3rem" />
          Usuarios
        </h2>
      </template>

      <template #end>
        <Button
          label="Crear usuario"
          icon="pi pi-plus"
          severity="success"
          class="mr-2"
          @click="dialogCreateUser = true"
        />
      </template>
    </Toolbar>
    <DataTable :value="users" tableStyle="min-width: 50rem">
      <Column field="username" header="Usuario" sortable></Column>
      <Column field="rol" header="Rol" sortable></Column>
      <Column :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
          <div class="flex justify-end">
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="deleteUser(slotProps.data._id, slotProps.data.username)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <Dialog
      v-model:visible="dialogCreateUser"
      modal
      header="Crear usuario"
      :style="{ width: '25rem' }"
    >
      <div class="flex flex-col gap-4">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <InputText v-model="createUser.username" placeholder="Usuario" />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon> <i class="pi pi-shield"> </i></InputGroupAddon>
          <Dropdown
            v-model="createUser.rol"
            :options="roles"
            placeholder="Seleccione un rol"
            class="w-full md:w-14rem"
          />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon> <i class="pi pi-key"> </i></InputGroupAddon>
          <Password v-model="createUser.password" toggleMask>
            <template #header>
              <h6>Ingrese Contraseña</h6>
            </template>
            <template #footer>
              <Divider />
              <p class="mt-2">Sugerencia</p>
              <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                <li>Al menos una minúscula</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos un número</li>
                <li>Mínimo 8 caracteres</li>
              </ul>
            </template>
          </Password>
        </InputGroup>
        <div class="flex justify-end gap-2 w-full">
          <Button
            type="button"
            label="Cancelar"
            severity="secondary"
            @click="dialogCreateUser = false"
          ></Button>
          <Button
            type="button"
            class="bg-primary"
            label="Crear"
            :disabled="!validCreateUser"
            @click="createUserDb()"
          ></Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
