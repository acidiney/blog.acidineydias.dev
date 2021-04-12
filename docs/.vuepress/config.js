module.exports = {
  title: 'Acidiney Dias',
  base: '/',
  dest: 'public',
  head: [
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: './assets/favicons/apple-touch-icon.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: './assets/favicons/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: './assets/favicons/favicon-16x16.png',
      },
    ],
    ['link', { rel: 'manifest', href: './assets/favicons/site.webmanifest' }],
    ['link', { rel: 'shortcut icon', href: './assets/favicons/favicon.ico' }],
    ['meta', { name: 'msapplication-TileColor', content: '#212121' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    [
      'script',
      {
        async: true,
        src:
          'https://www.googletagmanager.com/gtag/js?id=' +
          process.env.VUE_GOOGLE_ANALYTICS,
      },
    ],
    [
      'script',
      {},
      `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config',"${process.env.VUE_GOOGLE_ANALYTICS}");
      `,
    ],
  ],
  description: 'Meu blog pessoal, usando a forestry',
  logo: './assets/img/logo.jpeg',
  theme: require.resolve('../../'),
  themeConfig: {
    authors: ['Acidiney Dias'],
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/acidiney',
        },
        {
          type: 'instagram',
          link: 'https://www.instagram.com/acidineydias/',
        },
        {
          type: 'linkedin',
          link: 'https://linkedin.com/in/acidineydias',
        },
        {
          type: 'mail',
          link: 'mailto:hello@acidineydias.me',
        },
        {
          type: 'twitter',
          link: 'https://twitter.com/acidineydias',
        },
      ],
      copyright: [
        {
          text: 'Licensed MIT.',
          link: 'https://github.com/acidiney/blog.acidineydias.me',
        },
        {
          text: 'Made using Mediumish',
          link: 'https://github.com/acidiney/blog.acidineydias.me',
        },
      ],
    },

    sitemap: {
      hostname: 'https://github.com/acidineydias/blog.acidineydias.me/',
    },
    comment: {
      service: 'disqus',
      shortname: 'acidineydias',
    },
    newsletter: {
      endpoint: process.env.VUE_MAIL_CHIMP_POST,
    },
    feed: {
      canonical_base: 'https://github.com/acidineydias/blog.acidineydias.me/',
    },
    smoothScroll: true,
  },
  pwa: true
}
