/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA_ID?: string;
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  readonly PUBLIC_ADSENSE_SLOT?: string;
  readonly PUBLIC_NEWSLETTER_ENDPOINT?: string;
  readonly PUBLIC_DISQUS_SHORTNAME?: string;
}

interface ImportMeta { readonly env: ImportMetaEnv; }
