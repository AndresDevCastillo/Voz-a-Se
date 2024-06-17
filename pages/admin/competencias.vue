<script setup>
import { FilterMatchMode } from "primevue/api";

definePageMeta({
  layout: "admin",
});

const api = useApi();
const confirm = useConfirm();
const toast = useToast();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const DialogoCrearCompetencia = ref(false);
const expandedRows = ref([]);

const contenidos = ref([]);
const contenidosSeleccionados = ref([]);

const getContenidos = async () => {
  contenidos.value = await api("/contenido");
};

const competenciaCreada = async () => {
  await getContenidos();
  DialogoCrearCompetencia.value = false;
};

const confirmarDeleteSelect = () => {
  confirm.require({
    message: "Estas seguro de eliminar las competencias?",
    header: "Eliminar Competencias",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancelar",
    rejectProps: {
      label: "Cancelar",
      severity: "warn",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "error",
    },
    accept: () => {
      toast.add({
        severity: "success",
        summary: "Competencias eliminadas",
        detail: "Eliminados correctamente",
        life: 3000,
      });
    },
  });
};

await getContenidos();
</script>
<template>
  <div class="m-5">
    <Toolbar class="mb-6">
      <template #start>
        <Button
          label="Crear"
          icon="pi pi-plus"
          severity="success"
          class="mr-2"
          @click="DialogoCrearCompetencia = true"
        />
        <Button
          label="Borrar"
          v-show="contenidosSeleccionados.length"
          icon="pi pi-trash"
          severity="danger"
          :disabled="
            !contenidosSeleccionados || !contenidosSeleccionados.length
          "
          @click="confirmarDeleteSelect()"
        />
      </template>

      <template #end>
        <FileUpload
          mode="basic"
          accept="image/*"
          :maxFileSize="1000000"
          label="Importar"
          chooseLabel="Importar"
          class="mr-2"
          auto
        />
        <Button label="Exportar" icon="pi pi-upload" severity="help" />
      </template>
    </Toolbar>

    <DataTable
      v-model:expandedRows="expandedRows"
      v-model:selection="contenidosSeleccionados"
      :value="contenidos"
      dataKey="_id"
      :filters="filters"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h3 class="m-0">
            <i class="pi pi-graduation-cap" style="font-size: 1.3rem" />
            COMPETENCIAS
          </h3>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              placeholder="Buscar..."
            />
          </IconField>
        </div>
      </template>
      <Column
        selectionMode="multiple"
        style="width: 3rem"
        :exportable="false"
      ></Column>
      <Column expander style="width: 5rem" />
      <Column>
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <i class="pi pi-folder" />
            <p>{{ slotProps.data.competencia.toUpperCase() }}</p>
          </div>
        </template>
      </Column>
      <Column :exportable="false" style="min-width: 18rem">
        <template #body="slotProps">
          <div class="flex justify-end">
            <div class="actions flex gap-2">
              <Button icon="pi pi-plus" outlined rounded severity="success" />
              <Button
                icon="pi pi-pencil"
                outlined
                rounded
                @click="editProduct(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                @click="confirmDeleteProduct(slotProps.data)"
              />
            </div>
          </div>
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="p-4">
          <DataTable
            :value="slotProps.data.temas"
            tableStyle="min-width: 50rem"
          >
            <Column field="tema" header="Temas"></Column>
            <Column :exportable="false" style="min-width: 18rem">
              <template #body="slotProps">
                <div class="flex justify-end">
                  <div class="actions flex gap-2">
                    <Button
                      icon="pi pi-play"
                      outlined
                      rounded
                      severity="info"
                    />
                  </div>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
    <CompetenciasCrear
      :mostrarDialogo="DialogoCrearCompetencia"
      @cerrarDialogo="DialogoCrearCompetencia = false"
      @competenciaCreada="competenciaCreada()"
    />
  </div>
</template>
