<template>
  <div>
    <!--
    <div class="w3-container">
      <v-data-table
        :headers="headers"
        :items="Members"
        :items-per-page="5"
        class="elevation-1"
      >
      </v-data-table>
-->
    <v-container>
      <v-row>
        <v-spacer />
        <v-col max-width="578px">
          <v-toolbar flat color="white">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search Members"
              single-line
            ></v-text-field>
          </v-toolbar>
          <v-list>
            <v-list-item-group v-model="selectedMemberIndex" color="primary">
              <template v-for="(item, index) in searching">
                <v-divider :key="index"></v-divider>

                <v-list-item :key="item.username" @click="openDetailDialog()">
                  <v-list-item-avatar>
                    <v-img :src="item.avatarURL"></v-img>
                  </v-list-item-avatar>
                  <v-badge
                    v-if="item.role.superadmin || item.role.admin"
                    icon="mdi-crown"
                    :color="item.role.superadmin ? 'purple' : 'yellow'"
                    offset-x="20"
                    offset-y="-10"
                  />

                  <v-list-item-content>
                    <v-list-item-title>{{ item.username }}</v-list-item-title>
                    <div v-if="item.role.superadmin || item.role.admin">
                      (admin)
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-spacer />
      </v-row>
    </v-container>
    <!-- profile detail -->
    <v-dialog
      v-if="dialog"
      :value="true"
      max-width="450px"
      background-color="white"
      @input="dialog = false"
    >
      <Profile :profile="selectedMember" />
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Profile from '~/components/Profile.vue'
export default {
  name: 'MembersPage',
  components: {
    // eslint-disable-next-line
    Profile,
  },
  data() {
    return {
      /*
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
      */
      selectedMemberIndex: -1,
      search: '',
      dialog: false,
    }
  },
  computed: {
    Members() {
      return this.getMembers()
    },
    searching() {
      if (!this.search) return this.Members

      const search = this.search.toLowerCase()

      return this.Members.filter((item) => {
        const text = item.username.toLowerCase()

        return text.includes(search)
      })
    },
    selectedMember() {
      return this.Members[this.selectedMemberIndex]
    },
  },
  created() {
    this.bindProfiles()
  },
  methods: {
    ...mapGetters(['getMembers']),
    ...mapActions(['bindProfiles']),
    openDetailDialog() {
      console.log(
        `open dialog - selected member index ${this.selectedMemberIndex} - selected member:`
      )
      console.dir(this.selectedMember)
      this.dialog = true
    },
  },
}
</script>
