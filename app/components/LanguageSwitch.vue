<template>
  <NuxtLink
    class="language_switch"
    :style="'direction: ' + currentDir"
    v-for="locale in availableLocales"
    :key="locale.code"
    :to="switchLocalePath(locale.code)"
    @click="useGlobalStore().setLang(locale.code)"
  >
    <!-- <span>{{ locale.name }}</span> -->
    <span>{{ locale.code == "ar" ? "ع" : "En" }}</span>
    <i class="pi pi-globe"></i>
  </NuxtLink>
</template>

<script setup>
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const currentDir = computed(() => (locale.value == "ar" ? "rtl" : "ltr"));

const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code != locale.value);
});
</script>