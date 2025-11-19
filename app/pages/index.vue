<template>
  <div class="page">
    <h1>{{$t('title')}}</h1>
    <div v-if="data">
      <div v-for="item in data?.data?.products" :key="item.id">
        {{ item.id }}
      </div>
    </div>
  </div>
</template>

<script setup>
  const { data } = useApiAsyncData('products', 'https://dummyjson.com/products');

</script>

<style lang="scss" scoped>

</style>
