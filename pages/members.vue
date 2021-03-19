<template>
  <div>
    <div class="w3-top">
      <div class="w3-bar w3-indigo" style="letter-spacing: 4px">
        <h3 class="w3-bar-item">Members</h3>
      </div>
    </div>

    <div class="w3-container">
      <v-data-table
        :headers="headers"
        :items="Members"
        :items-per-page="5"
        class="elevation-1"
      >
      </v-data-table>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Profile from '~/components/Profile.vue'
export default {
  name: 'MembersPage',
  components: {
    // eslint-disable-next-line
    'member': Profile,
  },
  data() {
    return {
      headers: [
        {
          text: 'email',
          align: 'start',
          sortable: true,
          value: 'email',
        },
        {
          text: 'username',
          align: 'start',
          sortable: true,
          value: 'username',
        },
        {
          text: 'avatarURL',
          align: 'start',
          sortable: true,
          value: 'avatarURL',
        },
      ],
    }
  },
  computed: {
    Members() {
      return this.getMembers()
    },
  },
  created() {
    this.bindProfiles()
  },
  methods: {
    ...mapGetters(['getMembers']),
    ...mapActions(['bindProfiles']),
  },
}
</script>
