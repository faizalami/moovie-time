<script setup lang="ts">
interface Props {
  class: string;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})
</script>

<template>
  <section :class="props.class">
    <div class="mx-auto max-w-7xl grid md:grid-cols-5 md:auto-rows-fr gap-6">
      <Card v-for="index in Array(15).keys()" :key="index" />
    </div>
  </section>
</template>
