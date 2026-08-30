/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VUE_GOOGLE_ADSENSE?: string;
  readonly PUBLIC_GA_ID?: string;
  readonly PUBLIC_NEWSLETTER_ENDPOINT?: string;
  readonly PUBLIC_DISQUS_SHORTNAME?: string;
}

interface ImportMeta { readonly env: ImportMetaEnv; }
