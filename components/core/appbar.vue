<script setup lang="ts">
const visibleSidebar = ref(false);
const actionMenu = (action: string) => {};
import { ref } from "vue";

const op = ref();

const toggle = (event: any) => {
  op.value.toggle(event);
};
</script>

<template>
  <div class="appBarContainer">
    <Sidebar v-model:visible="visibleSidebar">
      <Menu :model="menu()" class="w-full">
        <template #submenuheader="{ item }">
          <span class="text-primary font-bold">{{ item.label }}</span>
        </template>

        <template #item="{ item, props }">
          <router-link :to="item.route" v-slot="{ href }" custom>
            <a
              :href="href"
              v-bind="props.action"
              @click="actionMenu(item.action)"
              class="flex items-center"
            >
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
        </template>
      </Menu>
    </Sidebar>
    <Menubar class="appBar bg-primary">
      <template #start>
        <div class="flex gap-2 items-center">
          <Button
            icon="pi pi-bars text-white"
            text
            size="large"
            @click="visibleSidebar = true"
          />
          <Avatar
            image=" /img/logoSena.svg"
            class="mr-2"
            size="large"
            shape="circle"
          />
          <a href="/" class="no-underline">
            <span class="text-2xl font-bold text-white"
              >Proyecto Decodificador De Voz</span
            >
          </a>
        </div>
      </template>
      <template #end>
        <Avatar
          @click="toggle"
          class="mr-2"
          size="large"
          shape="circle"
          image="/img/andres.jpg"
        />
        <div class="card flex">
          <OverlayPanel ref="op">
            <Menu :model="menuPerfil()" class="appBar" />
          </OverlayPanel>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<style>
.appBar {
  border-radius: 0 !important;
  border: 0 !important;
}

.p-sidebar-content > div,
.p-sidebar-content > .p-menu.p-component > .p-menu-end > .p-menu.p-component {
  background: none !important;
  border: 0 !important;
  min-width: 100% !important;
  border-radius: 0 !important;
  height: 100% !important;
}

.p-menu .p-submenu-header {
  background: none !important;
}
</style>
