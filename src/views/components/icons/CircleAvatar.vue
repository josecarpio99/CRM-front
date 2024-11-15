<template>
  <span 
  class="w-6 h-6 inline-block rounded-full overflow-hidden border-2 align-middle mr-2 focus:border-gray-300 focus:outline-none" :class="[{
    'border-violet-200': user?.branch == 'CDMX',
    'border-amber-500': user?.branch == 'AGS',
    'border-rose-300': user?.branch == 'MTY',
    'border-lime-300': user?.branch == 'QRO',
    'border-gray-400': !user?.branch
  }, props.class]">
    <img v-if="avatarUrl" class="avatar-img" :src="avatarUrl" alt="">

    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
    </svg>
  </span>
</template>

<script setup>

const props = defineProps({
  avatarUrl: {
    type: String,
    default: null
  },
  user: {
    type: Object,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})
</script>
