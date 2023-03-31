<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/20/solid'

export interface Props {
  movieId: number;
  title: string;
  year: string;
  genre: string;
  rating: number;
  image: string;
  overview: string;
  active: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  movieId: 0,
  title: '',
  year: '',
  genre: '',
  rating: 0,
  image: '',
  overview: '',
  active: false,
})

const imgSrc = ref(props.image ? `https://image.tmdb.org/t/p/w500${props.image}` : '/img/image-not-found.png')
</script>

<template>
  <div
    :class="{
      'py-5 pl-5': true,
      'opacity-50 hidden md:block': !active
    }"
  >
    <div class="flex h-[324px] bg-black">
      <img class="-m-5" :src="imgSrc" :alt="title">
      <div class="ml-10 py-6 pr-6 text-white">
        <p class="text-lg font-bold flex items-center">
          <StarIcon class="text-gold w-4 h-4" />
          {{ rating }}
        </p>

        <NuxtLink v-if="active" v-slot="{ href }" :to="`/movies/${movieId}`" custom>
          <a :href="href">
            <h1 class="text-xl md:text-3xl font-medium">{{ title }}</h1>
          </a>
        </NuxtLink>

        <h1 v-else class="md:text-3xl font-medium">
          {{ title }}
        </h1>

        <div class="flex items-center mt-3">
          <h2 class="mr-2">
            {{ year }}
          </h2>
          <span class="rounded-full w-2 h-2 bg-white/[0.5]" />
          <h2 class="ml-2">
            {{ genre }}
          </h2>
        </div>

        <p class="line-clamp-8 mt-3 text-xs">
          {{ overview }}
        </p>
      </div>
    </div>
  </div>
</template>
