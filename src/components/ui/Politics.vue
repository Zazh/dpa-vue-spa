<script setup>
defineProps({
  cookiesHref:  { type: String, default: '/cookies' },
  offerHref:    { type: String, default: '/offer' },
  privacyHref:  { type: String, default: '/privacy' },
  size:         { type: String, default: 'text-sm' },
  tight:        { type: Boolean, default: true },
  external:     { type: Boolean, default: false },
})
const aAttrs = (external) => external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
</script>

<template>
  <p :class="['font-medium text-gray-700', size, tight ? 'leading-tight' : 'leading-normal']">
    Продолжая, вы соглашаетесь
    <!-- Ломаем строку на мобилке аккуратно, без <br> -->
    <span class="block md:inline">
      с
      <a v-bind="aAttrs(external)" :href="cookiesHref" class="underline decoration-dotted text-black hover:text-blue-600">
        использованием файлов cookie
      </a>,
      <a v-bind="aAttrs(external)" :href="offerHref" class="underline decoration-dotted text-black hover:text-blue-600">
        публичной офертой
      </a>
    </span>
    <span class="block md:inline">
      и
      <a v-bind="aAttrs(external)" :href="privacyHref" class="underline decoration-dotted text-black hover:text-blue-600">
        политикой конфиденциальности
      </a>
    </span>
  </p>
</template>
