<template>
  <div class="empty">
    <NotFoundEyes />
    <h3 class="mt-5">{{ emptyText }}</h3>
  </div>
</template>

<script setup>
  const globalStore = useGlobalStore();

  const emptyText = ref(getEmptyText(globalStore.lang));

  // Watch for changes in globalStore.lang and update emptyText accordingly
  watch(
    () => globalStore.lang,
    (newLang) => {
      emptyText.value = getEmptyText(newLang);
    }
  );

  // Helper function to get the correct empty text based on the language
  function getEmptyText(lang) {
    return lang === 'ar' 
      ? 'لايوجد محتوي حتي الأن' 
      : lang === 'en' 
      ? 'No Content Found Yet' : ''
      // : 'ابھی تک کوئی مواد نہیں ہے۔';
  }
</script>

<style lang="scss" scoped>

</style>