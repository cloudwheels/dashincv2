<template>
  <v-card>
    <v-tabs
      v-model="tab"
      background-color="indigo"
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        Profile
        <v-icon>mdi-account</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        My Tasks
        <v-icon>mdi-format-list-checks</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
        My Admin
        <v-icon>mdi-crown</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item :value="'tab-1'">
        <v-card flat>
          <v-card-text>
            <span class="headline">{{ this.$store.state.user.uid }}</span>
            <span class="headline"
              >admin? {{ this.$store.state.user.admin }}</span
            >
            <div>
              <v-btn>Signout</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :value="'tab-2'">
        <v-card flat>
          <v-card-text>
            <MyTasks />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :value="'tab-3'">
        <v-card flat>
          <v-card-text> </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import MyTasks from '~/components/MyTasks.vue'
export default {
  middleware: 'auth',
  components: {
    MyTasks,
  },
  data() {
    return {
      user: '',
      tab: null,
    }
  },
}
</script>
