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
const competenciasSeleccionadas = ref([]);

const getContenidos = async () => {
  contenidos.value = await api("/contenido");
};

const idAgregarTema = ref("");
const showAgregarTema = ref(false);
const agregarTema = (id) => {
  idAgregarTema.value = id;
  showAgregarTema.value = true;
};

const competenciaCreada = async () => {
  await getContenidos();
  DialogoCrearCompetencia.value = false;
};
const temaActualizado = async () => {
  await getContenidos();
  showAgregarTema.value = false;
};

const confirmarDeleteSelectMulti = () => {
  confirm.require({
    message: "Estas seguro de eliminar las competencias?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancelar",
    acceptLabel: "Eliminar",
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        const body = competenciasSeleccionadas.value.map(
          (competencia) => competencia._id
        );
        await api("/contenido/competencias", {
          method: "DELETE",
          body,
        });
        await getContenidos();
        toast.add({
          severity: "success",
          summary: "Eliminados correctamente",
          detail: "Competencias eliminadas",
          life: 3000,
        });
      } catch (error) {
        console.log(error);
        toast.add({
          severity: "danger",
          summary: "Eliminar competencias",
          detail: "Ocurrio un problema!",
          life: 3000,
        });
      }
    },
  });
};

const confirmarDeleteCompetencia = (id) => {
  confirm.require({
    message: "Estas seguro de eliminar la competencia?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancelar",
    acceptLabel: "Eliminar",
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await api("/contenido/eliminar/" + id, {
          method: "DELETE",
        });
        await getContenidos();
        toast.add({
          severity: "success",
          summary: "Eliminado correctamente",
          detail: "Competencias eliminadas",
          life: 3000,
        });
      } catch (error) {
        console.log(error);
        toast.add({
          severity: "danger",
          summary: "Eliminar competencias",
          detail: "Ocurrio un problema!",
          life: 3000,
        });
      }
    },
  });
};

const confirmarDeleteTema = (id, posicion) => {
  confirm.require({
    message: "Estas seguro de eliminar el tema?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancelar",
    acceptLabel: "Eliminar",
    rejectClass: "p-button-secondary p-button-outlined",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await api("/contenido/tema/" + id + "/" + posicion, {
          method: "DELETE",
        });
        await getContenidos();
        toast.add({
          severity: "success",
          summary: "Eliminado correctamente",
          detail: "Tema eliminado",
          life: 3000,
        });
      } catch (error) {
        console.log(error);
        toast.add({
          severity: "danger",
          summary: "Eliminar Tema",
          detail: "Ocurrio un problema!",
          life: 3000,
        });
      }
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
          icon="pi pi-trash"
          severity="danger"
          :disabled="
            !competenciasSeleccionadas || !competenciasSeleccionadas.length
          "
          @click="confirmarDeleteSelectMulti()"
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
      v-model:selection="competenciasSeleccionadas"
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
              <Button
                icon="pi pi-plus"
                outlined
                rounded
                severity="success"
                @click="agregarTema(slotProps.data._id)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                @click="confirmarDeleteCompetencia(slotProps.data._id)"
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
              <template #body="slotTema">
                <div class="flex justify-end">
                  <div class="actions flex gap-2">
                    <Button
                      icon="pi pi-trash"
                      outlined
                      rounded
                      severity="danger"
                      @click="
                        confirmarDeleteTema(slotProps.data._id, slotTema.index)
                      "
                    />
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
    <CompetenciasAgregarTema
      :idActualizar="idAgregarTema"
      :mostrarDialogo="showAgregarTema"
      @cerrarDialogo="showAgregarTema = false"
      @temaAgregado="temaActualizado()"
    />
  </div>
</template>
