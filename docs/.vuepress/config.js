module.exports = {
  title: 'Acidiney Dias',
  base: '/',
  dest: 'public',
  description: 'Meu blog pessoal, usando a forestry',
  logo: './assets/img/logo.jpeg',
  theme: require.resolve('../../'),
  themeConfig: {
  authors: [
    ],
    footer: {
      contact: [
        {
          type: 'codepen',
          link: '#',
        },
        {
          type: 'facebook',
          link: '#',
        },
        {
          type: 'github',
          link: 'https://github.com/acidiney/blog.acidineydias.me',
        },
        {
          type: 'gitlab',
          link: '#',
        },
        {
          type: 'instagram',
          link: '#',
        },
        {
          type: 'linkedin',
          link: '#',
        },
        {
          type: 'mail',
          link: '#',
        },
        {
          type: 'messenger',
          link: '#',
        },
        {
          type: 'phone',
          link: '#',
        },
        {
          type: 'twitter',
          link: 'https://twitter.com/acidineydias',
        },
        {
          type: 'web',
          link: '#',
        }
      ],
      copyright: [
        {
          text: 'Licensed MIT.',
          link: '#',
        },
        {
          text: 'Made with Mediumish - free Vuepress theme',
          link: '#',
        },
      ],
    },

    sitemap: {
      hostname: 'https://github.com/acidineydias/blog.acidineydias.me/'
    },
    comment: {
      service: 'disqus',
      shortname: 'Acidiney Dias Blog',
    },
    newsletter: {
      endpoint: '#'
    },
    feed: {
      canonical_base: 'https://github.com/acidineydias/blog.acidineydias.me/',
    },
    smoothScroll: true
  },
}
