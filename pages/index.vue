<script setup lang="ts">
import type { Movies } from '~~/types/movies.type.js'
import type { Genres } from '~~/types/genres.type.js'
import type { Props as MovieItem } from '~~/components/Card.vue'

interface TransformedMovies extends Omit<Movies, 'results'> {
  results: MovieItem[];
}

const { data: responseGenres } = await useFetch('https://api.themoviedb.org/3/genre/movie/list?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US')

const genres = (responseGenres.value as Genres)?.genres || []

const { data: responseMovies } = await useFetch(
  'https://api.themoviedb.org/3/movie/popular?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US&page=1',
  {
    transform (data: Movies) {
      const results: MovieItem[] = data.results.map((movieItem) => {
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
      return { ...data, results }
    },
  },
)

const movies = (responseMovies.value as TransformedMovies)?.results || []

</script>

<template>
  <section class="mt-16 h-[530px] text-white">
    Hello world!
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
