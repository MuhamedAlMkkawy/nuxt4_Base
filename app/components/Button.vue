<template>
  <button :class="['main-btn', { 'disabled': disabled, 'loading': loading }]" :disabled="disabled" @click="onClick" :type="type">
    <span v-if="!loading">{{ label }}</span>
    <div v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
  </button>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  path : {
    type : String ,
    default : ""
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
});
const router = useRouter()
const localeRoute = useLocaleRoute()
const emit = defineEmits(['click']);

const onClick = () => {
  if (!props.disabled && !props.loading) {
    if(props.path){
      router.push(localeRoute(props.path))
    }else{
      emit('click');
    }
  }
};
</script>
