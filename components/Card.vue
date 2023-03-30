<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/20/solid'
</script>

<template>
  <div class="group w-full flex flex-col relative">
    <img class="w-full h-[330px] object-cover" src="https://image.tmdb.org/t/p/w500/wD2kUCX1Bb6oeIb2uz7kbdfLP6k.jpg" alt="Winnie the Pooh: Blood and Honey">
    <div class="absolute w-full flex items-center h-0 top-0 left-0 opacity-0 bg-black/[0.8] group-hover:h-full group-hover:opacity-100 duration-500">
      <div class="flex flex-col w-full text-center">
        <p class="text-white flex text-2xl font-semibold mx-auto h-0 group-hover:h-auto">
          <StarIcon class="w-8 h-8 mr-2 text-gold" />
          6.5
        </p>
        <p class="mt-0 text-white text-lg font-semibold h-0 group-hover:h-auto group-hover:mt-12">
          Action
        </p>
        <NuxtLink v-slot="{ navigate }" to="/movies/123" custom>
          <button
            class="mt-0 bg-primary rounded-full py-1.5 px-8 text-neutral-200 font-bold mx-auto h-0 group-hover:h-auto group-hover:mt-12"
            @click="navigate"
          >
            VIEW
          </button>
        </NuxtLink>
      </div>
    </div>
    <h2 class="font-semibold text-neutral-200 mt-3">
      Winnie the Pooh: Blood and Honey
    </h2>
    <h3 class="text-sm text-dark-grey">
      2023
    </h3>
  </div>
</template>
