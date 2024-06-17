<script setup>
import io from "socket.io-client";

definePageMeta({
  layout: "admin",
});

const userState = useUserStore();
const toast = useToast();
let socket;

const estado = ref(false);
const conectados = ref(0);
const message = ref("");
const messages = ref([]);

const conectar = () => {
  socket = io("http://localhost:3000", {
    extraHeaders: {
      authorization: `${userState.getToken()}`,
    },
  });

  socket.on("connect", () => {
    estado.value = true;
  });

  socket.on("disconnect", () => {
    estado.value = false;
  });

  socket.on("clientsconnect", (clients) => {
    console.log("ejecutado");
    updateclients(clients);
  });

  socket.on("message-server", (paquete) => {
    messages.value = paquete;
    console.log(messages.value);
  });
};

const updateclients = (clients) => {
  conectados.value = clients;
};

const desconectar = () => {
  conectados.value = 0;
  socket.disconnect();
};

const sendMessage = () => {
  if (!estado.value) {
    toast.add({
      severity: "warn",
      summary: "Chat",
      detail: "Por favor conectese primero",
      life: 3000,
    });
    return;
  }
  if (message.value !== "") {
    messages.value.push(message.value);
    socket.emit("msgToServer", {
      id: socket.id,
      mensaje: message.value,
    });
    message.value = "";
  }
};
</script>
<template>
  <div class="h-screen bg-green-400">
    <div class="m-5 w-96">
      <h2 class="text-xl font-bold text-green-400">Chat</h2>
      <div class="flex gap-4">
        <InlineMessage v-if="estado" severity="success"
          >Conectado</InlineMessage
        >
        <InlineMessage v-else severity="error">Desconectado</InlineMessage>
        <Button severity="info" :label="'Conectados: ' + conectados" />
      </div>
      <Textarea
        class="my-4 block"
        @keyup.enter="sendMessage()"
        v-model="message"
        rows="5"
        cols="30"
      />
      <div class="flex gap-4">
        <Button @click="desconectar()" severity="danger" label="Desconectar" />
        <Button @click="conectar()" label="Conectar" />
      </div>
      <Message icon="pi pi-send" class="w-96" :closable="false"
        >Mensajes Recibidos</Message
      >
      <Card>
        <template #content>
          <template v-for="valor in messages" :key="valor">
            <p class="m-0">
              {{ valor }}
            </p>
            <Divider />
          </template>
        </template>
      </Card>
    </div>
  </div>
</template>
