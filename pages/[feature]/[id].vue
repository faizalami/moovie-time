<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/20/solid'
import type { MovieDetail, Movies as MovieRecomendations } from '~~/types/movies.type'
import type { TvDetail, Tvs as TvRecomendation } from '~~/types/tvs.types'
import type { Genres } from '~~/types/genres.type'
import type { Comments } from '~~/types/comments.types'
import type { Props as MovieItem } from '~~/components/Card.vue'

interface TransformedDetail {
  year: string;
  title: string;
  genres: string;
  poster: string;
  backdrop: string;
  rating: number;
  voters: number;
  status: string;
  lang: string;
  budget?: number;
  prodCompany: string;
  overview: string;
}

interface TransformedRecom extends Omit<MovieRecomendations, 'results'> {
  results: MovieItem[];
}

const route = useRoute()
const { feature, id } = route.params

const featureUrl = ref('')
const featureName = ref('')

watchEffect(() => {
  switch (feature) {
    case 'movies':
      featureUrl.value = 'movie'
      featureName.value = 'MOVIES'
      break
    case 'tv-shows':
      featureUrl.value = 'tv'
      featureName.value = 'TV SHOWS'
      break
    default:
      throw createError({
        statusCode: 404,
        message: 'Page Not Found',
      })
  }
})

const { data: responseDetail } = await useFetch(
  `https://api.themoviedb.org/3/${featureUrl.value}/${id}?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US`,
  {
    transform (data) {
      let detail = {} as TransformedDetail

      if (feature === 'movies') {
        const responseData = data as MovieDetail
        detail = {
          year: responseData.release_date.substring(0, 4),
          title: responseData.title,
          genres: responseData.genres.map(item => item.name).join(', '),
          poster: `https://image.tmdb.org/t/p/w500${responseData.poster_path}`,
          backdrop: `https://image.tmdb.org/t/p/original${responseData.backdrop_path}`,
          rating: parseInt(String(responseData.vote_average * 10), 10) / 10,
          voters: responseData.vote_count,
          status: responseData.status,
          lang: responseData.spoken_languages[0].english_name,
          budget: responseData.budget,
          prodCompany: responseData.production_companies[0].name,
          overview: responseData.overview,
        }
      } else if (feature === 'tv-shows') {
        const responseData = data as TvDetail
        detail = {
          year: responseData.first_air_date.substring(0, 4),
          title: responseData.name,
          genres: responseData.genres.map(item => item.name).join(', '),
          poster: responseData.poster_path ? `https://image.tmdb.org/t/p/w500${responseData.poster_path}` : '/img/image-not-found.png',
          backdrop: responseData.backdrop_path ? `https://image.tmdb.org/t/p/original${responseData.backdrop_path}` : '/img/image-not-found.png',
          rating: parseInt(String(responseData.vote_average * 10), 10) / 10,
          voters: responseData.vote_count,
          status: responseData.status,
          lang: responseData.spoken_languages[0].english_name,
          prodCompany: responseData.production_companies[0].name,
          overview: responseData.overview,
        }
      }

      return detail
    },
  },
)

const detail = responseDetail.value as TransformedDetail

const { data: responseReviews } = await useFetch(`https://api.themoviedb.org/3/${featureUrl.value}/${id}/reviews?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US&page=1`)

const reviews = (responseReviews.value as Comments)?.results || []

const { data: responseGenres } = await useFetch(`https://api.themoviedb.org/3/genre/${featureUrl.value}/list?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US`)

const genres = (responseGenres.value as Genres)?.genres || []

const { data: responseItems } = await useFetch(
  `https://api.themoviedb.org/3/${featureUrl.value}/${id}/recommendations?api_key=f0ed16cec6f5c089dab07bd0c89aa2f5&language=en-US&page=1`,
  {
    transform (data) {
      let results: MovieItem[] = []
      switch (feature) {
        case 'movies':
          results = (data as MovieRecomendations).results.map((movieItem) => {
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
          results = (data as TvRecomendation).results.map((tvItem) => {
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

const recoms = (responseItems.value as TransformedRecom)?.results || []

</script>

<template>
  <section v-if="detail" class="h-[470px] w-full relative">
    <img class="absolute top-0 left-0 w-full h-full object-cover" :src="detail.backdrop" :alt="detail.title">

    <div class="flex flex-wrap items-end mx-auto max-w-7xl h-full relative">
      <div class="w-full md:w-56 mr-6 h-full flex-grow md:flex-grow-0 flex justify-center">
        <img class="absolute w-56 h-[330px] mt-[300px] top-0 z-20" :src="detail.poster" :alt="detail.title">
      </div>

      <div class="flex-col flex-1 mb-20 hidden md:flex">
        <p class="text-white font-medium">
          {{ detail.year }}
        </p>
        <h1 class="text-neutral-200 font-semibold text-4xl">
          {{ detail.title }}
        </h1>
        <h2 class="text-white font-medium">
          {{ detail.genres }}
        </h2>
      </div>
    </div>

    <div class="w-full bg-black/[0.5] -mt-14 h-full relative hidden md:block">
      <ul class="mx-auto max-w-7xl flex pl-64 h-14 py-2 box-border">
        <li class="text-4xl text-neutral-200 mr-2 flex items-center">
          <StarIcon class="text-gold w-8 h-8" />
          {{ detail.rating }}
        </li>
        <li class="flex flex-col justify-center pr-8">
          <span class="text-xs text-white/[0.5] font-medium">USER SCORE</span>
          <span class="text-xs text-white font-medium">{{ detail.voters }} VOTES</span>
        </li>
        <li class="flex flex-col justify-center px-8 border-l border-white/[0.2]">
          <span class="text-xs text-white/[0.5] font-medium">STATUS</span>
          <span class="text-xs text-white font-medium">{{ detail.status }}</span>
        </li>
        <li class="flex flex-col justify-center px-8 border-l border-white/[0.2]">
          <span class="text-xs text-white/[0.5] font-medium">LANGUAGE</span>
          <span class="text-xs text-white font-medium">{{ detail.lang }}</span>
        </li>
        <li v-if="detail.budget" class="flex flex-col justify-center px-8 border-l border-white/[0.2]">
          <span class="text-xs text-white/[0.5] font-medium">BUDGET</span>
          <span class="text-xs text-white font-medium">{{ detail.budget }}</span>
        </li>
        <li class="flex flex-col justify-center px-8 border-l border-white/[0.2]">
          <span class="text-xs text-white/[0.5] font-medium">PRODUCTION</span>
          <span class="text-xs text-white font-medium">{{ detail.prodCompany }}</span>
        </li>
      </ul>
    </div>
  </section>

  <section class="flex flex-col md:hidden pt-48">
    <div class="flex-col flex-1 mb-8 px-8">
      <p class="text-white font-medium">
        {{ detail.year }}
      </p>
      <h1 class="text-neutral-200 font-semibold text-4xl">
        {{ detail.title }}
      </h1>
      <h2 class="text-white font-medium">
        {{ detail.genres }}
      </h2>
    </div>

    <div class="w-full bg-black/[0.5] h-full">
      <ul class="mx-auto max-w-7xl flex flex-wrap py-2 box-border">
        <li class="text-4xl text-neutral-200 px-8 md:px-0 md:mr-2 flex items-center w-1/2 md:w-auto">
          <StarIcon class="text-gold w-8 h-8" />
          {{ detail.rating }}
        </li>
        <li class="flex flex-col justify-center px-8 md:pl-0 w-1/2 border-l border-white/[0.2] md:border-none md:w-auto">
          <span class="text-xs text-white/[0.5] font-medium">USER SCORE</span>
          <span class="text-xs text-white font-medium">{{ detail.voters }} VOTES</span>
        </li>
        <li class="flex flex-col justify-center px-8 border-l border-white/[0.2] w-1/2 md:w-auto">
          <span class="text-xs text-white/[0.5] font-medium">STATUS</span>
          <span class="text-xs text-white font-medium">{{ detail.status }}</span>
        </li>
        <li class="flex flex-col justify-center px-8 border-l border-white/[0.2] w-1/2 md:w-auto">
          <span class="text-xs text-white/[0.5] font-medium">LANGUAGE</span>
          <span class="text-xs text-white font-medium">{{ detail.lang }}</span>
        </li>
        <li v-if="detail.budget" class="flex flex-col justify-center px-8 border-l border-white/[0.2] w-1/2 md:w-auto">
          <span class="text-xs text-white/[0.5] font-medium">BUDGET</span>
          <span class="text-xs text-white font-medium">{{ detail.budget }}</span>
        </li>
        <li class="flex flex-col justify-center px-8 border-l border-white/[0.2] w-1/2 md:w-auto">
          <span class="text-xs text-white/[0.5] font-medium">PRODUCTION</span>
          <span class="text-xs text-white font-medium">{{ detail.prodCompany }}</span>
        </li>
      </ul>
    </div>
  </section>

  <section v-if="detail" class="bg-white z-10 relative md:h-48">
    <div class="mx-auto max-w-7xl px-4 md:pr-0 md:pl-64 py-8">
      <h2 class="text-primary font-semibold">
        OVERVIEW
      </h2>
      <p class="text-black font-medium text-base/[200%] w-full md:w-1/2">
        {{ detail.overview }}
      </p>
    </div>
  </section>

  <section v-if="detail" class="bg-white z-10 relative">
    <div class="mx-auto max-w-7xl py-8 px-4 md:px-0">
      <h2 class="text-primary font-semibold">
        REVIEWS
      </h2>
      <div class="grid md:grid-cols-2 gap-8 mt-6">
        <Review
          v-for="review in reviews.slice(0, 2)"
          :key="review.id"
          :user-name="review.author"
          :user-photo="review.author_details.avatar_path ? `https://image.tmdb.org/t/p/w500${review.author_details.avatar_path}` : '/img/image-not-found.png'"
          :date="review.updated_at"
          :rating="review.author_details.rating ? (parseInt(String(review.author_details.rating * 10), 10) / 10).toFixed(1) : 0"
          :content="review.content"
        />
      </div>
    </div>
  </section>

  <section>
    <div class="mx-auto max-w-7xl py-8">
      <h2 class="text-white font-semibold px-8 md:px-0">
        RECOMENDATION {{ featureName }}
      </h2>
      <MovieList class="mt-9 mb-32" :items="recoms.slice(0, 5)" />
    </div>
  </section>
</template>
