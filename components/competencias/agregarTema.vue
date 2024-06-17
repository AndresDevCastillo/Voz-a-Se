<script setup>
const toast = useToast();
const api = useApi();

const props = defineProps({
  mostrarDialogo: {
    default: false,
    type: Boolean,
  },
  idActualizar: {
    required: true,
    type: String,
  },
});

const emit = defineEmits([
  "update:mostrarDialogo",
  "cerrarDialogo",
  "temaAgregado",
]);
const mostrarDialogo = ref(props.mostrarDialogo);

watch(
  () => props.mostrarDialogo,
  (newValue) => {
    mostrarDialogo.value = newValue;
  }
);

watch(mostrarDialogo, (newValue) => {
  emit("update:mostrarDialogo", newValue);
  if (!newValue) {
    emit("cerrarDialogo");
  }
});

const agregarTema = async () => {
  try {
    if (!paqueteAgregarTema.value.tema || paqueteAgregarTema.value.tema == "") {
      toast.add({
        severity: "error",
        summary: "Agregar Tema",
        detail: "Rellene todos los campos!",
        life: 3000,
      });
      return;
    }

    const body = {
      tema: paqueteAgregarTema.value.tema,
    };
    await api("/contenido/agregarTema/" + props.idActualizar, {
      body,
      method: "PUT",
    });
    toast.add({
      severity: "success",
      summary: "Agregar Tema",
      detail: "Creado con exito!",
      life: 3000,
    });
    paqueteAgregarTema.value = {
      tema: null,
    };
    emit("temaAgregado");
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "Agregar Tema",
      detail: "Ocurrio un problema!",
      life: 3000,
    });
  }
};
const paqueteAgregarTema = ref({
  tema: null,
});
</script>
<template>
  <Dialog
    v-model:visible="mostrarDialogo"
    :style="{ width: '450px' }"
    header="Agregar Tema"
  >
    <div class="flex flex-col gap-6 p-fluid">
      <div>
        <label for="name" class="block font-bold mb-3"
          >Tema {{ paqueteAgregarTema }}</label
        >
        <InputText
          id="name"
          v-model.trim="paqueteAgregarTema.tema"
          required="true"
          autofocus
        />
      </div>
    </div>

    <template #footer>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        severity="danger"
        text
        @click="$emit('cerrarDialogo')"
      />
      <Button @click="agregarTema()" label="Crear" icon="pi pi-check" />
    </template>
  </Dialog>
</template>
