<script setup></script>
<template>
  <div>
    <Toast />
    <ConfirmDialog />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
body {
  margin: 0;
  padding: 0;
}

.bg-primary {
  background-color: #39a900;
  border: #39a900;
}

.bg-primary:hover {
  background-color: #28a745;
  border: #28a745 ;
}

.text-primary {
  color: #39a900;
}
</style>
