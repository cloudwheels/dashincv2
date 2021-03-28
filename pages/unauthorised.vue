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
        <v-card-title class="headline"> Not authorised </v-card-title>
        <v-card-text>
          <p>It looks don't have permissions to visit that page!</p>
          <p>
            All incubator data is public, but you need to be logged in to visit
            your dashboard or manage your profile.
          </p>
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
