<script setup>
const toast = useToast();
const api = useApi();

const props = defineProps({
  mostrarDialogo: {
    default: false,
    type: Boolean,
  },
});

const emit = defineEmits([
  "update:mostrarDialogo",
  "cerrarDialogo",
  "competenciaCreada",
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

const enterTemaTemp = () => {
  if (paqueteDialogo.value.temaTemp || paqueteDialogo.value.temaTemp !== "") {
    paqueteDialogo.value.temas.push({
      tema: paqueteDialogo.value.temaTemp,
    });
    paqueteDialogo.value.temaTemp = "";
  }
};

const crearCompetencia = () => {
  try {
    if (!paqueteDialogo.value.nombre || paqueteDialogo.value.nombre == "") {
      toast.add({
        severity: "error",
        summary: "Crear competencia",
        detail: "Rellene todos los campos!",
        life: 3000,
      });
      return;
    }

    const body = {
      competencia: paqueteDialogo.value.nombre,
      temas: paqueteDialogo.value.temas,
    };
    api("/contenido", {
      body,
      method: "POST",
    });
    toast.add({
      severity: "success",
      summary: "Crear competencia",
      detail: "Creado con exito!",
      life: 3000,
    });
    paqueteDialogo.value = {
      nombre: null,
      temaTemp: null,
      temas: [],
    };
    emit("competenciaCreada");
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "danger",
      summary: "Crear competencia",
      detail: "Ocurrio un problema!",
      life: 3000,
    });
  }
};
const paqueteDialogo = ref({
  nombre: null,
  temaTemp: null,
  temas: [],
});
</script>
<template>
  <Dialog
    v-model:visible="mostrarDialogo"
    :style="{ width: '450px' }"
    header="Crear Contenido"
  >
    <div class="flex flex-col gap-6 p-fluid">
      <div>
        <label for="name" class="block font-bold mb-3">Nombre</label>
        <InputText
          id="name"
          v-model.trim="paqueteDialogo.nombre"
          required="true"
          autofocus
        />
      </div>
      <div>
        <label for="name" class="block font-bold mb-3">Temas</label>
        <InputText
          id="temas"
          v-model.trim="paqueteDialogo.temaTemp"
          required="true"
          @keyup.enter="enterTemaTemp()"
        />
      </div>
      <div>
        <DataTable :value="paqueteDialogo.temas">
          <Column field="tema"></Column>
          <Column :exportable="false" style="min-width: 6rem">
            <template #body="slotProps">
              <div class="flex justify-end">
                <div class="actions flex gap-2">
                  <Button
                    icon="pi pi-trash"
                    outlined
                    rounded
                    severity="danger"
                    @click="paqueteDialogo.temas.splice(slotProps.index, 1)"
                  />
                </div>
              </div>
            </template>
          </Column>
        </DataTable>
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
      <Button @click="crearCompetencia()" label="Crear" icon="pi pi-check" />
    </template>
  </Dialog>
</template>
