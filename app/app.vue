<template>
  <NuxtLayout>
    <div class="container">
      <NuxtPage />
    </div>
    <Toast />
  </NuxtLayout>
</template>

<script setup>
  import Toast  from 'primevue/toast';
  
  const { locale } = useI18n()
  const currentDir = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));
  
  useHead({
    htmlAttrs: {
      lang: locale,
      dir: currentDir,
    },
  });
</script>


<style>
  .page-enter-active,
  .page-leave-active {
    transition: all 1s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    transform: scale(0.7) rotate(4deg);
    /* transform: translateY(50%) rotate(45deg); */
  }
</style>