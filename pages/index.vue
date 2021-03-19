<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <!--
        <logo />
        <vuetify-logo />
        -->
      </div>
      <v-card>
        <v-card-title class="headline">
          Welcome to Dash Incubator App
        </v-card-title>
        <v-card-text>
          <p>Dash Incubator provides rewards for helping to grow dash.</p>
          <p>
            For more information, check out the
            <a
              href="https://chat.dashdevs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord </a
            >.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/bounties"> Continue </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
/*
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo,
  },
}
*/
</script>
