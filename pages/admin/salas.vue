<script setup>
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const menu = ref(null);
var socket = null;

const dialogCrearSala = ref(false);
const dialogoCamara = ref(false);

const room = ref({
  room: null,
  username: null,
  message: "",
});

const chat_active = ref(false);
const chat_history = ref([]);
const last_message = ref({
  url: null,
  type: null, // video, gift
});

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

const drawLastMessage = (data) => {
  for (let i = data.length - 1; i >= 0; i--) {
    const message = data[i];

    if (message.video) {
      last_message.value = {
        url: message.video,
        type: "video",
      };

      console.log(last_message.value);
      break;
    }
  }
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
    console.log(data);
    chat_history.value = data;
    drawLastMessage(data);
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

function createVideoSrcFromBase64(base64) {
  return `data:video/mp4;base64,${base64}`;
}

const sendVideo = (chunks) => {
  dialogoCamara.value = false;
  console.log(chunks);

  if (Array.isArray(chunks) && chunks.length > 0) {
    // Asegúrate de que chunks sea un array y no esté vacío
    chunks.forEach((chunk) => {
      console.log(chunk);
      socket.emit("video_chunk", {
        room: room.value.room,
        username: room.value.username,
        ...chunk,
      });
    });
  } else {
    console.error("chunks no es un arreglo o está vacío");
  }
};
</script>
<template>
  <div class="flex flex-col min-h-screen m-5">
    <Toolbar v-if="!chat_active">
      <template #start>
        <Button icon="pi pi-plus" class="mr-2 bg-primary" />
        <Button icon="pi pi-print" class="mr-2 bg-primary" />
      </template>

      <template #end>
        <Button
          icon="pi pi-plus"
          label="Salas"
          class="bg-primary"
          @click="dialogCrearSala = true"
        />
      </template>
    </Toolbar>
    <Panel class="flex-grow" v-if="chat_active">
      <template #header>
        <div class="flex menu_chat items-center gap-2">
          <Avatar size="large" :label="room.username[0]" shape="circle" />
          <span class="font-bold">{{ room.username }}</span>
        </div>
      </template>

      <template #icons>
        <div class="flex gap-1">
          <Button icon="pi pi-hashtag" class="bg-primary" :label="room.room" />
          <Button icon="pi pi-cog" class="bg-primary" click="toggle"> </Button>
        </div>
        <Menu ref="menu" id="config_menu" :model="menu_chat" popup />
      </template>
      <div class="relative">
        <div class="chat h-80 flex p-5">
          <div class="w-full overflow-auto p-5">
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
                  <span v-if="chat.message != 'videoSocket'" class="ml-2">{{
                    chat.message
                  }}</span>
                  <video
                    v-if="chat.video"
                    :src="createVideoSrcFromBase64(chat.video)"
                    width="200"
                    autoplay
                    loop
                    muted
                  />
                </Message>
              </div>
            </template>
          </div>
          <Divider layout="vertical" />
          <div class="w-full">
            <video
              class="object-cover"
              style="margin: 20px"
              v-if="last_message.url"
              :src="createVideoSrcFromBase64(last_message.url)"
              autoplay
              loop
              muted
            />
          </div>
        </div>
        <div class="flex gap-1 mt-10 p-2 rounded-md">
          <Button
            icon="pi pi-video "
            class="bg-primary"
            @click="dialogoCamara = true"
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
            class="bg-primary"
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
            class="bg-primary"
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
            class="bg-primary"
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
    <Dialog
      v-model:visible="dialogoCamara"
      modal
      header="Camara"
      :style="{ width: '28rem' }"
    >
      <div class="flex flex-col gap-4">
        <SalasCamara @send-video="sendVideo" />
      </div>
    </Dialog>
  </div>
</template>
