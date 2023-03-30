<script setup lang="ts">
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from '@headlessui/vue'
import { Squares2X2Icon } from '@heroicons/vue/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

interface MovieKeywords {
  id: number,
  name: string,
}

const movies: MovieKeywords[] = [
  { id: 1, name: 'Wade Cooper' },
  { id: 2, name: 'Arlene Mccoy' },
  { id: 3, name: 'Devon Webb' },
  { id: 4, name: 'Tom Cook' },
  { id: 5, name: 'Tanya Fox' },
  { id: 6, name: 'Hellen Schmidt' },
]

const selectedMovie = ref('')
const query = ref('')

const filteredPeople = computed(() =>
  query.value === ''
    ? movies
    : movies.filter(movie =>
      movie.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, '')),
    ),
)
</script>

<template>
  <nav class="bg-white/[0.05] text-sm fixed w-full">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center">
        <div class="w-full flex items-center justify-between">
          <div class="flex-shrink-0">
            <NuxtLink to="/">
              <img class="h-8 w-15 object-contain" src="/img/moovietime-logo.png" alt="MoovieTime">
            </NuxtLink>
          </div>

          <Combobox v-model="selectedMovie" class="hidden md:block text-neutral-200">
            <div class="relative mt-1">
              <div
                class="relative h-8 w-96 cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
              >
                <ComboboxInput
                  class="w-full bg-black/[0.13] border-none py-2 pl-8 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:ring-offset-0 outline-none"
                  :display-value="(movie) => (movie as MovieKeywords).name"
                  @change="query = $event.target.value"
                />
                <div
                  class="absolute inset-y-0 left-0 flex items-center pl-2"
                >
                  <img src="/img/search.png" class="h-4 w-4" alt="Search Movies">
                </div>
                <div
                  class="absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <MagnifyingGlassIcon
                    class="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <TransitionRoot
                leave="transition ease-in duration-100"
                leave-from="opacity-100"
                leave-to="opacity-0"
                @after-leave="query = ''"
              >
                <ComboboxOptions
                  class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-black/[0.9] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  <div
                    v-if="filteredPeople.length === 0 && query !== ''"
                    class="relative cursor-default select-none py-2 px-4 text-gray-700"
                  >
                    Nothing found.
                  </div>

                  <ComboboxOption
                    v-for="movie in filteredPeople"
                    :key="movie.id"
                    as="template"
                    :value="movie"
                  >
                    <li class="relative cursor-default select-none py-2 px-4">
                      <span class="block truncate">
                        {{ movie.name }}
                      </span>
                    </li>
                  </ComboboxOption>
                </ComboboxOptions>
              </TransitionRoot>
            </div>
          </Combobox>

          <div class="hidden md:block">
            <div class="ml-10 flex items-center space-x-4 text-neutral-200">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton
                    class="rounded-md px-3 py-2 font-medium flex items-center"
                  >
                    <Squares2X2Icon class="h-5 w-5 mr-2" /> CATEGORIES
                  </MenuButton>
                </div>

                <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <MenuItems
                    class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div class="px-1 py-1">
                      <MenuItem>
                        <button class="group flex w-full text-secondary items-center rounded-md px-2 py-2 text-sm">
                          ACTION
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button class="group flex w-full text-secondary items-center rounded-md px-2 py-2 text-sm">
                          ADVENTURE
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button class="group flex w-full text-secondary items-center rounded-md px-2 py-2 text-sm">
                          ANIMATION
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button class="group flex w-full text-secondary items-center rounded-md px-2 py-2 text-sm">
                          COMEDY
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>

              <NuxtLink v-slot="{ href, target }" to="/movies" custom>
                <a :href="href" :target="target" class="rounded-md px-3 py-2 font-medium">MOVIES</a>
              </NuxtLink>

              <NuxtLink v-slot="{ href, target }" to="/tv-shows" custom>
                <a :href="href" :target="target" class="rounded-md px-3 py-2 font-medium">TV SHOWS</a>
              </NuxtLink>

              <a href="#" class="rounded-md px-3 py-2 font-medium">LOGIN</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div id="mobile-menu" class="md:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
        <a href="#" class="rounded-md px-3 py-2 text-sm font-medium">CATEGORIES</a>

        <NuxtLink v-slot="{ href, target }" to="/movies" custom>
          <a :href="href" :target="target" class="rounded-md px-3 py-2 text-sm font-medium">MOVIES</a>
        </NuxtLink>

        <NuxtLink v-slot="{ href, target }" to="/tv-shows" custom>
          <a :href="href" :target="target" class="rounded-md px-3 py-2 text-sm font-medium">TV SHOWS</a>
        </NuxtLink>

        <a href="#" class="rounded-md px-3 py-2 text-sm font-medium">LOGIN</a>
      </div>
    </div>
  </nav>
</template>
