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
const expandedRows = ref([]);

const contenidos = ref([]);

const getContenidos = async () => {
  contenidos.value = await api("/contenido");
};

await getContenidos();
</script>
<template>
  <div class="m-5">
    <DataTable
      v-model:expandedRows="expandedRows"
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

      <Column expander style="width: 5rem" />
      <Column>
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <i class="pi pi-folder" />
            <p>{{ slotProps.data.competencia.toUpperCase() }}</p>
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
  </div>
</template>
