<script setup>
definePageMeta({
  layout: "admin",
});

const menu = ref(null);
let socket = null;

const dialogCrearSala = ref(false);

const room = ref({
  room: null,
  username: null,
  message: "",
});

const chat_active = ref(false);
const chat_history = ref([]);

function generateRandomRoom(length = 4) {
  const characters = "ABCDEF1234567890";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  room.value.room = result;
}

const menu_chat = ref([
  {
    label: "Refresh",
    icon: "pi pi-refresh",
  },
  {
    label: "Search",
    icon: "pi pi-search",
  },
  {
    separator: true,
  },
  {
    label: "Delete",
    icon: "pi pi-times",
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

const crearSala = () => {
  socket = useSocket();

  socket.on("connect", () => {
    console.log("connect");
    chat_active.value = true;
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
    chat_active.value = false;
  });

  socket.on("chatHistory", (data) => {
    chat_history.value = data;
  });

  socket.emit("joinRoom", room.value);

  dialogCrearSala.value = false;
};

const sendMessage = () => {
  if (room.value.message.trim() === "") return;
  socket.emit("message", {
    room: room.value.room,
    username: room.value.username,
    message: room.value.message,
  });
  room.value.message = ""; // Clear the input after sending the message
};

const sendImage = (event) => {
  console.log("SendImage");
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64Image = reader.result;
    socket.emit("image", {
      room: room.value.room,
      username: room.value.username,
      image: base64Image,
    });
  };
  reader.readAsDataURL(file);
};
</script>
<template>
  <div class="m-5">
    <Toolbar v-if="!chat_active">
      <template #start>
        <Button icon="pi pi-plus" class="mr-2" severity="secondary" />
        <Button icon="pi pi-print" class="mr-2" severity="secondary" />
      </template>

      <template #end>
        <Button
          icon="pi pi-plus"
          label="Salas"
          @click="dialogCrearSala = true"
        />
      </template>
    </Toolbar>
    <Panel v-if="chat_active">
      <template #header>
        <div class="flex menu_chat items-center gap-2">
          <Avatar size="large" :label="room.username[0]" shape="circle" />
          <span class="font-bold">{{ room.username }}</span>
        </div>
      </template>

      <template #icons>
        <div class="flex gap-1">
          <Button icon="pi pi-hashtag" :label="room.room" />
          <Button icon="pi pi-cog" @click="toggle"> </Button>
        </div>
        <Menu ref="menu" id="config_menu" :model="menu_chat" popup />
      </template>
      <div class="relative">
        <div class="chat h-80">
          <template v-for="chat in chat_history">
            <div
              :class="
                chat.username == room.username ? 'flex justify-end' : 'flex'
              "
            >
              <Message
                severity="success"
                class="inline-block"
                :closable="false"
              >
                <template #messageicon>
                  <Avatar
                    class="mr-2"
                    :label="chat.username[0]"
                    shape="circle"
                  />
                </template>
                <span v-if="chat.message != 'ImageSocket'" class="ml-2">{{
                  chat.message
                }}</span>
                <!-- Mostrar imagen si existe -->
                <Image
                  v-if="chat.image"
                  :src="chat.image"
                  alt="Image"
                  width="200"
                  preview
                />
              </Message>
            </div>
          </template>
        </div>
        <div class="flex gap-1 mt-3 bg-primary p-2 rounded-md">
          <Button icon="pi pi-image" @click="$refs.fileInput.click()" />
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="sendImage($event)"
            class="hidden"
          />
          <InputText
            placeholder="Escribe un mensaje.."
            v-model="room.message"
            @keydown.enter="sendMessage"
            class="w-full"
          />
          <Button
            :disabled="!room.message || room.message == ''"
            @click="sendMessage()"
            icon="pi pi-send"
          />
        </div>
      </div>
    </Panel>

    <Dialog
      v-model:visible="dialogCrearSala"
      modal
      header="Sala"
      :style="{ width: '25rem' }"
    >
      <div class="flex flex-col gap-4">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <InputText v-model="room.username" placeholder="Usuario" />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon> <i class="pi pi-hashtag"> </i></InputGroupAddon>
          <InputText placeholder="Codigo" v-model="room.room" />
          <Button
            icon="pi pi-sync"
            @click="generateRandomRoom()"
            severity="warning"
          />
        </InputGroup>
        <div class="flex justify-end gap-2 w-full">
          <Button
            type="button"
            label="Cancelar"
            severity="secondary"
            @click="dialogCrearSala = false"
          ></Button>
          <Button
            type="button"
            label="Entrar"
            :disabled="
              !room.room ||
              !room.username ||
              room.room == '' ||
              room.username == ''
            "
            @click="crearSala()"
          ></Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
