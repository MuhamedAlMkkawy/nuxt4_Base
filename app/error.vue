<template>
  <div class="error_page">
    <div class="image">
      <img src="/assets/images/logo.svg" alt="logo image" loading="lazy" />
    </div>

    <h1>
      4
      <NotFoundEyes />
      4
    </h1>

    <h3>
      {{ $t("error_page.title") }}
    </h3>

    <NuxtLink :to="localeRoute('/')" class="main-btn">
      {{ $t("error_page.go_home") }}
    </NuxtLink>
  </div>
</template>

<script setup>
// define locale route
const localeRoute = useLocaleRoute();
</script>

<style lang="scss">
.error_page {
  @include displayFlex($direction: column, $gap: 0);
  height: 100vh;
  background: $secColor;
  position: relative;
  .image {
    width: 300px;
    height: 200px;
    margin: 0 auto;
    img {
      object-fit: contain;
    }
    @media (max-width: 560px) {
      width: 200px;
    }
  }

  h1 {
    font-size: 150px;
    margin-bottom: 0px;
    color: $mainColor;
    @include displayFlex($gap: 20px);
    span {
      color: $secColor;
    }
  }

  h3 {
    font-size: clamp(30px, 100%, 300px);
    margin-bottom: 10px;
  }
  a {
    max-width: 500px;
  }
}
</style>
