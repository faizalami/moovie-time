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

  <MovieList class="-mt-44 mb-32" />
</template>
