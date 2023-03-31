<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'

import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import type { Movies } from '~~/types/movies.type'
import type { Tvs } from '~~/types/tvs.types'
import type { Genres } from '~~/types/genres.type'
import type { Props as MovieItem } from '~~/components/Card.vue'

interface TransformedItems extends Omit<Movies, 'results'> {
  results: MovieItem[];
}

const pageName = ref('')
const featureUrl = ref('')

const route = useRoute()
const { feature } = route.params

watchEffect(() => {
  switch (feature) {
    case 'movies':
      pageName.value = 'Movies'
      featureUrl.value = 'movie'
      break
    case 'tv-shows':
      pageName.value = 'TV Shows'
      featureUrl.value = 'tv'
      break
    default:
      throw createError({
        statusCode: 404,
        message: 'Page Not Found',
      })
  }
})

useServerSeoMeta({
  title: () => `${pageName.value} | MoovieTime`,
  ogTitle: () => `${pageName.value} | MoovieTime`,
  description: () => `Discover thousands of ${pageName.value} in MoovieTime.`,
  ogDescription: () => `Discover thousands of ${pageName.value} in MoovieTime.`,
})

useSeoMeta({
  title: () => `${pageName.value} | MoovieTime`,
  ogTitle: () => `${pageName.value} | MoovieTime`,
  description: () => `Discover thousands of ${pageName.value} in MoovieTime.`,
  ogDescription: () => `Discover thousands of ${pageName.value} in MoovieTime.`,
})

const { data: responseGenres } = await useFetch(`https://api.themoviedb.org/3/genre/${featureUrl.value}/list?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US`)

const genres = (responseGenres.value as Genres)?.genres || []

const { data: responseItems } = await useFetch(
  `https://api.themoviedb.org/3/${featureUrl.value}/popular?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US&page=1`,
  {
    transform (data) {
      let results: MovieItem[] = []
      switch (feature) {
        case 'movies':
          results = (data as Movies).results.map((movieItem) => {
            const genre = genres.find((genreItem) => {
              return genreItem.id === movieItem.genre_ids?.[0]
            })

            return {
              movieId: movieItem.id,
              title: movieItem.title,
              year: movieItem.release_date?.substring(0, 4) || '',
              genre: genre?.name || 'Unknown',
              rating: parseInt(String(movieItem.vote_average * 10), 10) / 10,
              image: movieItem.poster_path,
            }
          })
          break
        case 'tv-shows':
          results = (data as Tvs).results.map((tvItem) => {
            const genre = genres.find((genreItem) => {
              return genreItem.id === tvItem.genre_ids?.[0]
            })

            return {
              movieId: tvItem.id,
              title: tvItem.name,
              year: tvItem.first_air_date?.substring(0, 4) || '',
              genre: genre?.name || 'Unknown',
              rating: parseInt(String(tvItem.vote_average * 10), 10) / 10,
              image: tvItem.poster_path || '',
            }
          })
          break
      }

      return { ...(data as unknown as {}), results }
    },
  },
)

const items = (responseItems.value as TransformedItems)?.results || []

const sort = [
  { name: 'Popularity Ascending' },
  { name: 'Popularity Descending' },
  { name: 'Release Date Ascending' },
  { name: 'Release Date Descending' },
  { name: 'Rating Ascending' },
  { name: 'Rating Descending' },
]
const selectedSort = ref(sort[0])
</script>

<template>
  <section class="bg-white/[0.05] h-[390px] text-neutral-200 pt-64 md:pt-32 box-border">
    <div class="mx-auto max-w-7xl px-4 md:px-0">
      <div class="w-28 border-t-4 pt-1 border-decoration">
        <h1 class="w-52 text-2xl font-semibold">
          {{ pageName }}
        </h1>
      </div>
    </div>
  </section>

  <section>
    <div class="mx-auto max-w-7xl flex items-start flex-wrap">
      <aside class="mx-4 md:mx-0 w-full md:w-60 md:mr-[30px] -mt-44 mb-8 md:mb-32 rounded bg-gradient-to-b from-[#0E1723] to-secondary">
        <div class="p-5 text-neutral-200 font-semibold border-b border-white/[0.07]">
          Sort Results By
        </div>

        <div class="p-5 text-neutral-200 border-b border-white/[0.07]">
          <Listbox v-model="selectedSort">
            <div class="relative mt-1">
              <ListboxButton
                class="relative w-full cursor-default rounded-lg bg-[#E0E0E0]/[0.13] py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
              >
                <span class="block truncate">{{ selectedSort.name }}</span>
                <span
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <ChevronDownIcon
                    class="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>

              <transition
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions
                  class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#111419] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  <ListboxOption
                    v-for="sortItem in sort"
                    :key="sortItem.name"
                    :value="sortItem"
                    as="template"
                  >
                    <li class="relative cursor-default select-none py-2 px-4">
                      <span class="block truncate">{{ sortItem.name }}</span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <div class="p-5 text-neutral-200 font-semibold border-b border-white/[0.07]">
          Genres
        </div>

        <div class="p-5 text-white">
          <ul>
            <li
              v-for="genreItem in genres"
              :key="genreItem.id"
              class="flex justify-between mb-4"
            >
              <span>
                {{ genreItem.name }}
              </span>

              <input name="genres" type="checkbox" class="h-4 w-4 rounded border-gray-30 text-white bg-white/[0.2] focus:ring-decoration checked:bg-decoration">
            </li>
          </ul>
        </div>
      </aside>

      <MovieList class="md:-mt-44 mb-16 flex-1" :items="items" :columns="4" />

      <div class="basis-full md:ml-64 mb-16 text-center">
        <button class="bg-primary text-neutral-200 rounded-full py-1.5 px-4">
          Load More
        </button>
      </div>
    </div>
  </section>
</template>
