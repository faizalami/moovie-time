<script setup lang="ts">
import type { Movies } from '~~/types/movies.type.js'
import type { Genres } from '~~/types/genres.type.js'
import type { Props as MovieItem } from '~~/components/SliderItem.vue'

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

const sliderItems = (responseSlider.value as TransformedMovies)?.results.slice(0, 3) || []

const { data: responseMovies } = await useFetch(
  'https://api.themoviedb.org/3/movie/popular?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US&page=1',
  {
    transform: normalizer,
  },
)

const movies = (responseMovies.value as TransformedMovies)?.results || []

</script>

<template>
  <section class="pt-32 pb-12 text-white w-full overflow-hidden">
    <div class="-mx-16 relative -left-16 grid grid-cols-3 gap-8">
      <SliderItem
        v-for="(item, index) in sliderItems"
        :key="item.movieId"
        :active="index === 1"
        :movie-id="item.movieId"
        :title="item.title"
        :year="item.year"
        :genre="item.genre"
        :rating="item.rating"
        :image="item.image"
        :overview="item.overview"
      />
    </div>
    <div class="w-full flex justify-center mt-12">
      <div
        v-for="(item, index) in sliderItems"
        :key="item.movieId"
        :class="{
          'rounded-full h-4 mx-2': true,
          'w-16 bg-decoration': index === 1,
          'w-4 bg-white/[0.5]': index !== 1,
        }"
      />
    </div>
  </section>

  <section class="bg-white/[0.05] h-[333px] text-neutral-200 pt-20 box-border">
    <div class="mx-auto max-w-7xl flex items-center justify-between">
      <div class="w-28 border-t-4 pt-1 border-decoration">
        <h1 class="w-52 text-2xl font-semibold">
          Discover Movie
        </h1>
      </div>
      <div class="text-sm font-semibold">
        <button class="bg-primary rounded-full py-1.5 px-4 mr-5">
          Popularity
        </button>
        <button class="bg-black/[0.2] rounded-full py-1.5 px-4">
          Popularity
        </button>
      </div>
    </div>
  </section>

  <MovieList class="-mt-44 mb-32" :items="movies" />
</template>
