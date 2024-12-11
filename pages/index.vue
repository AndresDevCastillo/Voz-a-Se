<script setup>
definePageMeta({
  layout: "admin",
  middleware: "auth",
});
</script>
<template>
  <div class="main-container min-h-screen bg-gray-100 flex flex-col items-center p-6">
    <!-- Título del proyecto -->
    <h1 class="text-4xl font-bold text-gray-800 mb-4 text-center">Bienvenido al Decodificador de Voz y Lenguaje de Señas</h1>

    <!-- Descripción -->
    <p class="text-lg text-gray-600 mb-8 text-center max-w-3xl">
      Este proyecto es una herramienta inclusiva diseñada para convertir la voz a lenguaje de señas y viceversa. Facilita la comunicación entre personas sordas y oyentes, brindando una experiencia accesible e innovadora.
    </p>

    <!-- Video tutorial -->
    <div class="video-container mb-10">
      <video class="rounded-lg shadow-lg w-full max-w-4xl" controls>
        <source src="~/assets/video/tutorial.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>
    </div>

    <!-- Sección de iframes de YouTube -->
    <div class="iframe-container grid grid-cols-1 md:grid-cols-3 gap-6">
      <iframe class="rounded-lg shadow-lg w-full h-64" src="https://www.youtube.com/embed/dVgSvJyVyfI?si=JFSxduXtmSP_eIZc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      <iframe class="rounded-lg shadow-lg w-full h-64" src="https://www.youtube.com/embed/tS_tqGkRUV0?si=CPomi1isqeyW9Ux8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      <iframe class="rounded-lg shadow-lg w-full h-64" src="https://www.youtube.com/embed/S8cataJg6gg?si=ds2lCzqlFWueTSWa" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>
  </div>
</template>
