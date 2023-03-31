<script setup lang="ts">
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/vue/20/solid'
import type { Movies } from '~~/types/movies.type.js'
import type { Genres } from '~~/types/genres.type.js'
import type { Props as MovieItem } from '~~/components/SliderItem.vue'

useServerSeoMeta({
  title: 'MoovieTime',
  ogTitle: 'MoovieTime',
  description: 'Find your favorite movies and tv shows in MoovieTime.',
  ogDescription: 'Find your favorite movies and tv shows in MoovieTime.',
})

useSeoMeta({
  title: 'MoovieTime',
  ogTitle: 'MoovieTime',
  description: 'Find your favorite movies and tv shows in MoovieTime.',
  ogDescription: 'Find your favorite movies and tv shows in MoovieTime.',
})

type MovieItems = Omit<MovieItem, 'active'>[]

interface TransformedMovies extends Omit<Movies, 'results'> {
  results: MovieItems;
}

function normalizer (data: Movies) {
  const results: MovieItems = data.results.map((movieItem) => {
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
      overview: movieItem.overview,
    }
  })
  return { ...data, results }
}

const { data: responseGenres } = await useFetch('https://api.themoviedb.org/3/genre/movie/list?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US')

const genres = (responseGenres.value as Genres)?.genres || []

const { data: responseSlider } = await useFetch(
  'https://api.themoviedb.org/3/movie/now_playing?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US&page=1',
  {
    transform: normalizer,
  },
)

const sliderItems = (responseSlider.value as TransformedMovies)?.results.slice(0, 6) || []

const { data: responseMovies } = await useFetch(
  'https://api.themoviedb.org/3/movie/popular?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US&page=1',
  {
    transform: normalizer,
  },
)

const movies = (responseMovies.value as TransformedMovies)?.results || []

const sliderIndex = ref(1)
const displaySlider = computed(() => {
  if (sliderIndex.value === 0) {
    return [...sliderItems.slice(-1), ...sliderItems.slice(0, 2)]
  } else if (sliderIndex.value === sliderItems.length - 1) {
    return [...sliderItems.slice(-2), ...sliderItems.slice(0, 1)]
  } else {
    return sliderItems.slice(sliderIndex.value - 1, sliderIndex.value + 2)
  }
})

function handleSliderClick (itemId?: number) {
  sliderIndex.value = sliderItems.findIndex(item => item.movieId === itemId)
}
</script>

<template>
  <section class="pt-64 md:pt-32 pb-12 text-white w-full overflow-hidden">
    <div class="md:-mx-16 relative md:-left-16 grid md:grid-cols-3 gap-8">
      <SliderItem
        v-for="(item, index) in displaySlider"
        :key="item.movieId"
        :active="index === 1"
        :movie-id="item.movieId"
        :title="item.title"
        :year="item.year"
        :genre="item.genre"
        :rating="item.rating"
        :image="item.image"
        :overview="item.overview"
        @click="() => handleSliderClick(item.movieId)"
      />
    </div>
    <div class="w-full flex justify-center items-center mt-12">
      <ArrowLeftCircleIcon class="text-decoration w-12 h-12 block md:hidden" @click="() => handleSliderClick(displaySlider[0]?.movieId)" />
      <div
        v-for="index in sliderItems.keys()"
        :key="index"
        :class="{
          'rounded-full h-4 mx-2': true,
          'w-16 bg-decoration': index === sliderIndex,
          'w-4 bg-white/[0.5]': index !== sliderIndex,
        }"
      />
      <ArrowRightCircleIcon class="text-decoration w-12 h-12 block md:hidden" @click="() => handleSliderClick(displaySlider[2]?.movieId)" />
    </div>
  </section>

  <section class="bg-white/[0.05] h-[333px] text-neutral-200 pt-20 box-border">
    <div class="px-4 md:p-0 mx-auto max-w-7xl flex items-center justify-between flex-wrap">
      <div class="w-28 border-t-4 pt-1 border-decoration">
        <h1 class="w-52 text-2xl font-semibold">
          Discover Movie
        </h1>
      </div>
      <div class="w-full md:w-auto text-sm font-semibold flex justify-center md:justify-end py-4">
        <button class="bg-primary rounded-full py-1.5 px-4 mr-5">
          Popularity
        </button>
        <button class="bg-black/[0.2] rounded-full py-1.5 px-4">
          Popularity
        </button>
      </div>
    </div>
  </section>

  <MovieList class="-mt-32 md:-mt-44 mb-32" :items="movies" />
</template>
