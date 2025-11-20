<template>
  <div class="page">
    <!-- <h1>{{$t('title')}} => Products</h1> -->
    <div v-if="data">
      <div v-for="item in data?.data?.products" :key="item.id">
        {{ item?.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
  const { data } = useApiAsyncData('products', 'https://dummyjson.com/products' , false , true);
</script>

<style lang="scss" scoped>

</style>
