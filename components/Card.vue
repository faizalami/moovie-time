<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/20/solid'

export interface Props {
  movieId: number;
  title: string;
  year: string;
  genre: string;
  rating: number;
  image: string;
}

const props = withDefaults(defineProps<Props>(), {
  movieId: 0,
  title: '',
  year: '',
  genre: '',
  rating: 0,
  image: '',
})

const imgSrc = ref(props.image ? `https://image.tmdb.org/t/p/w500${props.image}` : '/img/image-not-found.png')
</script>

<template>
  <div class="group w-full flex flex-col relative">
    <img class="w-full h-[330px] object-cover" :src="imgSrc" alt="Winnie the Pooh: Blood and Honey">

    <div class="absolute top-0 right-0 bg-secondary/[0.8] py-1 px-2">
      <p class="text-lg font-bold text-neutral-200">
        {{ rating }}
      </p>
    </div>

    <h2 class="font-semibold text-neutral-200 mt-3">
      {{ title }}
    </h2>
    <h3 class="text-sm text-dark-grey">
      {{ year }}
    </h3>

    <div class="absolute w-full flex items-center h-0 top-0 left-0 opacity-0 bg-black/[0.8] group-hover:h-full group-hover:opacity-100 duration-500">
      <div class="flex flex-col w-full text-center">
        <p class="text-white flex text-2xl font-semibold mx-auto h-0 group-hover:h-auto">
          <StarIcon class="w-8 h-8 mr-2 text-gold" />
          {{ rating }}
        </p>
        <p class="mt-0 text-white text-lg font-semibold h-0 group-hover:h-auto group-hover:mt-12">
          {{ genre }}
        </p>
        <NuxtLink v-slot="{ navigate }" :to="`/movies/${movieId}`" custom>
          <button
            class="mt-0 bg-primary rounded-full py-1.5 px-8 text-neutral-200 font-bold mx-auto h-0 group-hover:h-auto group-hover:mt-12"
            @click="navigate"
          >
            VIEW
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
