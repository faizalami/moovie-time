<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/20/solid'

export interface Props {
  userName: string;
  userPhoto: string;
  date: string;
  rating: number | string;
  content: string;
}

withDefaults(defineProps<Props>(), {
  userName: '',
  userPhoto: '',
  date: '',
  rating: '',
  content: '',
})
</script>

<template>
  <div class="rounded bg-[#F9F9F9] h-72 max-h-72 px-6 py-5 drop-shadow-md">
    <div class="flex justify-between">
      <div class="flex">
        <img class="w-12 h-12 object-cover rounded-full mr-5" :src="userPhoto" :alt="userName">
        <div>
          <h2 class="text-secondary font-bold">
            {{ userName }}
          </h2>
          <p class="text-[#666] text-xs">
            {{ date }}
          </p>
        </div>
      </div>

      <div class="text-4xl text-black p-1 rounded bg-[#C4C4C4]/[0.28] flex">
        <StarIcon class="w-4 h-4 mt-1 text-gold" />
        {{ rating }}
      </div>
    </div>

    <div class="mt-6">
      <p class="line-clamp-8 text-[13px]/[19.5px] italic">
        {{ content }}
      </p>
      <a href="#" class="text-decoration text-[13px]/[19.5px] underline italic">read the rest.</a>
    </div>
  </div>
</template>
