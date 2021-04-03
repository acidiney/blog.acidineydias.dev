<template>
  <div>
    <h6 class="text-white text-center mt-0 mb-4"> 🤗 Oiiii, bem vindo ao meu blog.
      <p class="text-secondary">Espero que ache alguma coisa interessante aqui 🥰</p>
    </h6>
    <BaseListLayout v-if="$pagination" />
    <Content v-else />
  </div>
</template>
