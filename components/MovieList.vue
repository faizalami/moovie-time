<script setup lang="ts">

import type { Props as MovieItem } from './Card.vue'

interface Props {
  class: string;
  columns: 4 | 5;
  items: MovieItem[];
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  columns: 5,
  items: () => [],
})
</script>

<template>
  <section :class="props.class">
    <div :class="`mx-auto max-w-7xl px-4 md:px-0 grid md:grid-cols-${columns} md:auto-rows-fr gap-6`">
      <Card
        v-for="movie in items"
        :key="movie.movieId"
        :movie-id="movie.movieId"
        :title="movie.title"
        :year="movie.year"
        :genre="movie.genre"
        :rating="movie.rating"
        :image="movie.image"
      />
    </div>
  </section>
</template>
