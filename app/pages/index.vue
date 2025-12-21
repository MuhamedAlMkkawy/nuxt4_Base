<template>
  <div class="page">
  <VeeForm 
    :validation-schema="globalSchema" 
    class="form" 
    @submit="console.log($event)"
    v-slot="{ meta }"
  >
    <CustomField 
      name="name"
      type="text"
      placeholder="name"
      @updateInputField="console.log($event)"
    />
  </VeeForm>
    <!-- <h1>{{$t('title')}} => Products</h1> -->
    <div v-if="data">
      <div v-for="item in data?.data?.products" :key="item.id">
        {{ item?.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { globalSchema } from '@/schemas/global'
  import { useApiAsyncData } from '@/composables/useApiFetch'


  const { data } = useApiAsyncData('products', 'https://dummyjson.com/products' , false , true);
</script>

<style lang="scss" scoped>

</style>
