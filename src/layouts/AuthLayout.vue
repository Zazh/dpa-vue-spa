<template>
<div class="min-h-screen flex flex-col bg-gray-100" >
  <main class="main">
    <section class="authorization-section" :class="containerClass">
      <div class="authorization-form" >
        <slot />
      </div>
    </section>
  </main>
  <Footer />
</div>
</template>

<script setup>
import Footer from '@/components/Footer.vue'

defineProps({
  containerClass: {
    type: String,
    default: 'mt-[3%]'
  }
});
</script>