<script setup lang="ts">
const pageName = ref('')

const route = useRoute()

watchEffect(() => {
  const { feature } = route.params

  switch (feature) {
    case 'movies':
      pageName.value = 'Movies'
      break
    case 'tv-shows':
      pageName.value = 'TV Shows'
      break
    default:
      throw createError({
        statusCode: 404,
        message: 'Page Not Found',
      })
  }
})
</script>

<template>
  <section class="bg-white/[0.05] h-[390px] text-neutral-200 pt-32 box-border">
    <div class="mx-auto max-w-7xl">
      <div class="w-28 border-t-4 pt-1 border-decoration">
        <h1 class="w-52 text-2xl font-semibold">
          {{ pageName }}
        </h1>
      </div>
    </div>
  </section>

  <MovieList class="-mt-44 mb-32" />
</template>
