<template>
  <footer class="themefooter">
    <div class="container">
      <div class="row justify-content-between">
        <div class="col">
          <div class="col-md-3 text-center">
            <a href="/"
            ><img
              class="logofooter rounded-circle"
              :src="$withBase($themeConfig.logo)"
            />
          </a>
          </div>
          <h4 class="mt-2 ml-2 text-white">{{ $site.title }}</h4>
          <p class=" ml-2 "> Software developer</p>
        </div>
        <div class="col d-flex flex-column justify-content-end text-right">
          <ul v-if="contact" class="mb-0 d-flex flex-row justify-content-end list-unstyled">
            <li
              v-for="item in contact"
              :key="item.iconComponent"
              class="contact-item ml-3"
            >
              <NavLink :link="item.link">
                <component :is="item.iconComponent"></component>
                {{ item.text }}
              </NavLink>
            </li>
          </ul>
          <ul v-if="copyright" class="list-unstyled">
            <li
              v-for="item in copyright"
              :key="item.text"
              class="copyright-item"
            >
              <NavLink :link="item.link">{{ item.text }}</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  TwitterIcon,
} from 'vue-feather-icons'

export default {
  components: {
    GithubIcon,
    LinkedinIcon,
    MailIcon,
    TwitterIcon,
  },

  computed: {
    contact() {
      return (
        (this.$themeConfig.footer && this.$themeConfig.footer.contact) ||
        []
      )
        .map(({ type, link }) => {
          return {
            iconComponent: this.getIconComponentName(type),
            link,
          }
        })
        .filter(({ iconComponent }) => iconComponent)
    },

    copyright() {
      return (
        (this.$themeConfig.footer && this.$themeConfig.footer.copyright) || []
      )
    },
  },

  methods: {
    getIconComponentName(contactType) {
      switch (contactType) {
        case 'github':
          return 'GithubIcon'
        case 'twitter':
          return 'TwitterIcon'
        case 'linkedin':
          return 'LinkedinIcon'
        case 'mail':
          return 'MailIcon'
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.contact-item:hover a
  color #cecece !important
</style>
