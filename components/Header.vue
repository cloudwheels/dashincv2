<template>
  <div>
    <!-- nav drawer -->
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="!$store.state.user"
          @click.stop="showSignInDialog = true"
        >
          <v-list-item-action>
            <v-icon>mdi-login</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sign In</v-list-item-title>
          </v-list-item-content>
          <SignInDialog v-model="showSignInDialog" />
        </v-list-item>
        <v-list-item
          v-if="!$store.state.user"
          @click.stop="showRegisterDialog = true"
        >
          <v-list-item-action>
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Register</v-list-item-title>
          </v-list-item-content>
          <RegisterDialog v-model="showRegisterDialog" />
        </v-list-item>
        <v-list-item v-if="$store.state.user" to="/dashboard">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="$store.state.user" @click="signOut">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/concepts">
          <v-list-item-action>
            <v-icon>mdi-lightbulb-on-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Concepts</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/bounties">
          <v-list-item-action>
            <v-icon>mdi-currency-usd-circle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Bounties</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/history">
          <v-list-item-action>
            <v-icon>mdi-history</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>History</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/members">
          <v-list-item-action>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Members</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- top app-bar -->
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SignInDialog from '~/components/SignInDialog'
import RegisterDialog from '~/components/RegisterDialog'

export default {
  components: {
    SignInDialog,
    RegisterDialog,
  },
  data() {
    return {
      showSignInDialog: false,
      showRegisterDialog: false,
      clipped: false,
      drawer: false,
      fixed: false,
      title: '',
    }
  },

  computed: {
    ...mapGetters({
      user: 'user',
    }),
  },

  methods: {
    // signOut(err) {
    signOut() {
      this.$store.dispatch('signOut')

      // .catch((err) => {
      //  alert(err.message)
      // })
    },
  },
}
</script>

<style scoped></style>
