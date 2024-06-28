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
  background-color: #10b981;
}
</style>
