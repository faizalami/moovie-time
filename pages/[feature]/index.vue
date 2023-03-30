<script setup lang="ts">
import type { Movies } from '~~/types/movies.type'
import type { Tvs } from '~~/types/tvs.types'
import type { Genres } from '~~/types/genres.type'
import type { Props as MovieItem } from '~~/components/Card.vue'

interface TransformedItems extends Omit<Movies, 'results'> {
  results: MovieItem[];
}

const pageName = ref('')
const genreUrl = ref('')
const itemsUrl = ref('')

const route = useRoute()
const { feature } = route.params

watchEffect(() => {
  switch (feature) {
    case 'movies':
      pageName.value = 'Movies'
      genreUrl.value = 'https://api.themoviedb.org/3/genre/movie/list?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US'
      itemsUrl.value = 'https://api.themoviedb.org/3/movie/popular?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US&page=1'
      break
    case 'tv-shows':
      pageName.value = 'TV Shows'
      genreUrl.value = 'https://api.themoviedb.org/3/genre/tv/list?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US'
      itemsUrl.value = 'https://api.themoviedb.org/3/tv/popular?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US&page=1'
      break
    default:
      throw createError({
        statusCode: 404,
        message: 'Page Not Found',
      })
  }
})

const { data: responseGenres } = await useFetch(genreUrl)

const genres = (responseGenres.value as Genres)?.genres || []

const { data: responseItems } = await useFetch(
  itemsUrl,
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
              rating: movieItem.vote_average,
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
              rating: tvItem.vote_average,
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

  <MovieList class="-mt-44 mb-32" :items="items" />
</template>
