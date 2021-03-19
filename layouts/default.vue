<template>
  <v-app>
    <!-- header -->
    <Header />
    <!-- main content -->
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <!-- footer -->
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Header from '~/components/Header.vue'

export default {
  components: {
    Header,
  },
  mounted() {
    this.initDarkMode()
  },

  methods: {
    initDarkMode() {
      if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
        console.log('🎉 Dark mode is supported')
      }
      const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      console.log(
        'Is dark theme set?:',
        window.matchMedia('(prefers-color-scheme)').media
      )

      darkMediaQuery.addEventListener('change', (e) => {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      })

      if (darkMediaQuery.matches) {
        console.log('change default light to dark theme')
        // need to set 0 sec timeout to set the dark more after mounted event, due to some bug in the framework
        setTimeout(() => (this.$vuetify.theme.dark = true), 0)
      }
    },
  },
}
</script>
