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
    <div v-if="getResult">
      <div v-for="item in getResult?.products" :key="item.id">
        {{ item?.title }}
      </div>
    </div>
    <Button label="text" class="w-[150px]" />
  </div>
</template>

<script setup>
  import { globalSchema } from '@/schemas/global'

  const {
    getMethod ,
    getResult
  } = useApiMethods()

  onMounted(async ()=> {
    await getMethod('https://dummyjson.com/products' , false , true);
  })
</script>

<style lang="scss" scoped>

</style>
