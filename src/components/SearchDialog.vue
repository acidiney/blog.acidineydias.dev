<script setup lang="ts">
import { nextTick, ref } from 'vue';

type PagefindResult = { id: string; score: number; data: () => Promise<{ url: string; meta: { title?: string }; excerpt: string }> };
type PagefindInstance = {
  init: () => Promise<void>;
  mergeIndex: (path: string, options: { language: 'pt' | 'en' }) => Promise<void>;
  search: (term: string) => Promise<{ results: PagefindResult[] }>;
};
type PagefindModule = { createInstance: (options: { language: 'pt' | 'en' }) => PagefindInstance };
const open = ref(false);
const query = ref('');
const loading = ref(false);
const results = ref<Array<{ id: string; url: string; title: string; excerpt: string }>>([]);
const dialog = ref<HTMLDialogElement>();
let searchInstance: Promise<PagefindInstance> | undefined;

function getSearchInstance(): Promise<PagefindInstance> {
  if (!searchInstance) {
    searchInstance = (async () => {
      const importer = new Function('return import("/pagefind/pagefind.js")');
      const pagefind = await importer() as PagefindModule;
      const primaryLanguage = document.documentElement.lang === 'en' ? 'en' : 'pt';
      const secondaryLanguage = primaryLanguage === 'pt' ? 'en' : 'pt';
      const instance = pagefind.createInstance({ language: primaryLanguage });
      await instance.init();
      await instance.mergeIndex(new URL('/pagefind/', window.location.origin).href, { language: secondaryLanguage });
      return instance;
    })();
  }
  return searchInstance;
}

async function show() {
  open.value = true;
  await nextTick();
  dialog.value?.showModal();
  dialog.value?.querySelector<HTMLInputElement>('input')?.focus();
}

function close() {
  dialog.value?.close();
  open.value = false;
}

async function search() {
  const term = query.value.trim();
  if (!term) { results.value = []; return; }
  loading.value = true;
  try {
    const instance = await getSearchInstance();
    const response = await instance.search(term);
    const ranked = response.results
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
      .filter((result, index, all) => all.findIndex((candidate) => candidate.id === result.id) === index);
    const hydrated = await Promise.all(ranked.map(async (result) => {
      const data = await result.data();
      return { id: result.id, score: result.score, url: data.url, title: data.meta.title ?? 'Sem título', excerpt: data.excerpt };
    }));
    results.value = hydrated
      .sort((a, b) => b.score - a.score || a.url.localeCompare(b.url))
      .filter((result, index, all) => all.findIndex((candidate) => candidate.url === result.url) === index)
      .slice(0, 8);
  } finally { loading.value = false; }
}
</script>

<template>
  <button class="search-button" type="button" data-testid="search-trigger" aria-label="Pesquisar no site" @click="show">Pesquisar <span aria-hidden="true">⌕</span></button>
  <dialog ref="dialog" class="search-dialog" data-testid="search-dialog" @close="open = false">
    <form class="search-bar" @submit.prevent="search">
      <label class="sr-only" for="site-search">Pesquisar artigos</label>
      <input id="site-search" v-model="query" type="search" placeholder="Procure uma ideia…" autocomplete="off">
      <button type="submit">Pesquisar</button>
      <button class="close" type="button" aria-label="Fechar pesquisa" @click="close">×</button>
    </form>
    <p v-if="loading" class="muted" role="status">A procurar…</p>
    <div v-else data-testid="search-results" aria-live="polite">
      <p v-if="query && !results.length" class="muted">Nenhum resultado.</p>
      <ol v-else class="results">
        <li v-for="result in results" :key="result.id">
          <a :href="result.url" @click="close">{{ result.title }}</a>
          <p v-html="result.excerpt" />
        </li>
      </ol>
    </div>
  </dialog>
</template>

<style scoped>
.search-dialog { width: min(720px, calc(100% - 2rem)); max-height: 78vh; margin: 10vh auto; border: 1px solid #67625a; border-radius: .8rem; background: #292929; color: #f8f4eb; padding: 1.2rem; }
.search-dialog::backdrop { background: rgb(0 0 0 / .72); backdrop-filter: blur(5px); }
.search-bar { display: grid; grid-template-columns: 1fr auto auto; gap: .6rem; }
input { min-width: 0; border: 1px solid #5d5953; border-radius: .45rem; background: #181818; color: white; padding: .75rem; font: inherit; }
button { border: 0; border-radius: .45rem; background: #f0b44d; color: #212121; padding: .7rem .9rem; font-weight: 800; cursor: pointer; }
.close { background: transparent; color: #f8f4eb; font-size: 1.5rem; }
.results { list-style: none; padding: 0; margin: 1.5rem 0 0; }
.results li { border-top: 1px solid #4a4743; padding: 1rem 0; }
.results a { color: #ffd178; font-family: Georgia, serif; font-size: 1.3rem; font-weight: 700; }
.results p { color: #c4beb4; margin: .3rem 0 0; font-size: .95rem; }
@media (max-width: 520px) {
  .search-bar { grid-template-columns: minmax(0, 1fr) auto; }
  .search-bar button[type="submit"] { grid-column: 1 / -1; grid-row: 2; }
  .close { position: static; grid-column: 2; grid-row: 1; min-width: 44px; min-height: 44px; padding: .3rem .7rem; }
}
</style>
