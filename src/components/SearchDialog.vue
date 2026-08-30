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
const searched = ref(false);
const errorMessage = ref('');
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
  if (!term) {
    results.value = [];
    searched.value = false;
    errorMessage.value = '';
    return;
  }
  loading.value = true;
  searched.value = false;
  errorMessage.value = '';
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
    searched.value = true;
  } catch {
    results.value = [];
    searched.value = true;
    errorMessage.value = 'Não foi possível pesquisar. Tente novamente.';
  } finally { loading.value = false; }
}
</script>

<template>
  <button class="search-button" type="button" data-testid="search-trigger" aria-label="Pesquisar no site" @click="show">Pesquisar <span aria-hidden="true">⌕</span></button>
  <dialog ref="dialog" class="search-dialog" data-testid="search-dialog" aria-labelledby="search-dialog-title" @close="open = false">
    <header class="search-dialog__header">
      <h2 id="search-dialog-title">Pesquisar nos textos</h2>
      <button class="close" type="button" aria-label="Fechar pesquisa" @click="close">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
    </header>
    <form class="search-bar" @submit.prevent="search">
      <label class="sr-only" for="site-search">Pesquisar artigos</label>
      <input id="site-search" v-model="query" type="search" placeholder="Procure uma ideia…" autocomplete="off">
      <button class="submit" type="submit">
        <span>Pesquisar</span>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
      </button>
    </form>
    <div class="search-content" data-testid="search-results" aria-live="polite">
      <p v-if="loading" class="search-status" role="status">A procurar…</p>
      <p v-else-if="errorMessage" class="search-status search-status--error">{{ errorMessage }}</p>
      <p v-else-if="searched && !results.length" class="search-status">Nenhum texto encontrado.</p>
      <ol v-else-if="results.length" class="results">
        <li v-for="result in results" :key="result.id">
          <a :href="result.url" @click="close">{{ result.title }}</a>
          <p v-html="result.excerpt" />
        </li>
      </ol>
    </div>
  </dialog>
</template>

<style scoped>
.search-dialog {
  width: min(560px, calc(100% - 2rem));
  max-height: min(720px, calc(100dvh - 2rem));
  margin: auto;
  border: 1px solid var(--rule);
  border-radius: 3px;
  background: var(--surface);
  color: var(--ink);
  padding: 0;
  overflow: hidden;
}
.search-dialog::backdrop { background: rgb(33 33 33 / .36); }
.search-dialog__header { min-height: 48px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .25rem .45rem .25rem 1rem; border-bottom: 1px solid var(--soft-rule); }
.search-dialog__header h2 { margin: 0; font-family: var(--font-display); font-size: .76rem; font-weight: 700; letter-spacing: .01em; }
.close { width: 40px; height: 40px; display: grid; place-items: center; border: 0; background: transparent; color: var(--muted); cursor: pointer; }
.close:hover { color: var(--ink); }
.close svg { width: 18px; fill: none; stroke: currentColor; stroke-linecap: square; stroke-width: 1.75; }
.search-bar { display: grid; grid-template-columns: minmax(0, 1fr) auto; }
input { min-width: 0; height: 64px; border: 0; background: transparent; color: var(--ink); padding: 0 1rem; font-family: "Inter", ui-sans-serif, system-ui, sans-serif; font-size: 1.05rem; }
input::placeholder { color: var(--muted); opacity: 1; }
input:focus-visible { outline: 0; box-shadow: inset 0 -2px 0 var(--ink); }
.submit { min-width: 132px; min-height: 64px; display: inline-flex; align-items: center; justify-content: center; gap: .55rem; border: 0; border-left: 1px solid var(--soft-rule); background: var(--ink); color: var(--inverse-ink); padding: 0 1.1rem; font-family: var(--font-display); font-size: .82rem; font-weight: 700; cursor: pointer; }
.submit:hover { background: #343432; }
.submit svg { width: 17px; fill: none; stroke: currentColor; stroke-linecap: square; stroke-linejoin: miter; stroke-width: 1.7; }
.search-content:not(:empty) { max-height: min(520px, calc(100dvh - 130px)); overflow-y: auto; border-top: 1px solid var(--soft-rule); }
.search-status { margin: 0; padding: 1rem; color: var(--muted); font-family: "Inter", ui-sans-serif, system-ui, sans-serif; font-size: .9rem; }
.search-status--error { color: var(--ink); }
.results { list-style: none; padding: 0; margin: 0; }
.results li { padding: 1rem; border-top: 1px solid var(--soft-rule); }
.results li:first-child { border-top: 0; }
.results a { color: var(--ink); font-family: var(--font-display); font-size: 1.02rem; font-weight: 700; letter-spacing: -.015em; text-decoration-thickness: 1px; }
.results p { margin: .35rem 0 0; color: var(--muted); font-family: "Inter", ui-sans-serif, system-ui, sans-serif; font-size: .86rem; line-height: 1.55; }
.results :deep(mark) { background: transparent; color: var(--ink); font-weight: 700; }
@media (max-width: 420px) {
  .search-dialog { width: calc(100% - 2rem); }
  .search-bar { grid-template-columns: 1fr; }
  input { height: 58px; }
  .submit { min-height: 50px; border-top: 1px solid var(--soft-rule); border-left: 0; }
  .search-content:not(:empty) { max-height: calc(100dvh - 174px); }
}
</style>
