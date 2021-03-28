<template>
  <v-container>
    <v-card>
      <v-row>
        <v-col>
          <v-avatar>
            <v-img :src="profile.avatarURL"></v-img>
          </v-avatar>
          <v-badge
            v-if="profile.role.superadmin || profile.role.admin"
            icon="mdi-crown"
            :color="profile.role.superadmin ? 'purple' : 'yellow'"
            offset-x="20"
            offset-y="-10"
          />
        </v-col>
        <v-col>{{ profile.username }}</v-col>
        <v-spacer />
      </v-row>
      <v-row
        ><v-col>Unique id: {{ profile.id }}</v-col></v-row
      >
      <v-row>
        <v-col v-if="canPromote">
          <v-btn @click.stop="promoteOrDemote(true)">Promote</v-btn>
        </v-col>
        <v-col v-if="canDemote">
          <v-btn @click.stop="promoteOrDemote(false)">Demote</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: 'Profile',
  props: { profile: { type: Object, default: () => {} } },
  computed: {
    canPromote() {
      /*
      console.log(
        
        `curent user is superadmin: ${this.$store.state.user.superadmin}`
      )
      console.log(`profile is not superadmin: ${!this.profile.role.superadmin}`)
      console.log(`profile is not admin: ${!this.profile.role.admin}`)
      console.log(`profile id ${this.profile.id} `)
      console.log(`current user id: ${this.$store.state.user.uid}`)
      console.log(
        `curent user is not profil: ${
          this.profile.id !== this.$store.state.user.uid
        }`
      )
      */
      if (this.$store.state.user) {
        return (
          this.$store.state.user.superadmin &&
          !this.profile.role.superadmin &&
          !this.profile.role.admin &&
          this.profile.id !== this.$store.state.user.uid
        )
      } else {
        return false
      }
    },
    canDemote() {
      /*
      console.log(
        `curent user is superadmin: ${this.$store.state.user.superadmin}`
      )

      console.log(`profile is  admin: ${this.profile.role.admin}`)
      console.log(`profile id ${this.profile.id} `)
      console.log(`current user id: ${this.$store.state.user.uid}`)
      console.log(
        `curent user is not profil: ${
          this.profile.id !== this.$store.state.user.uid
        }`
      )
      */
      if (this.$store.state.user) {
        return (
          this.$store.state.user.superadmin &&
          this.profile.role.admin &&
          this.profile.id !== this.$store.state.user.uid
        )
      } else {
        return false
      }
    },
  },
  mounted() {
    console.log(`profile.mounted with member data: `)
    console.dir(this.profile)
  },
  methods: {
    promoteOrDemote(promote = false) {
      let admin = {
        role: {
          member: true,
        },
      }
      if (promote) {
        admin = {
          role: {
            admin: true,
          },
        }
      }
      const setAdmin = this.$fire.functions.httpsCallable('setAdmin')
      const data = { uid: this.profile.id, role: admin.role }
      console.log(
        `${
          promote ? 'PROMOTE' : 'DEMOTE'
        } ADMIN USER WITH DATA ${JSON.stringify(data)}`
      )
      setAdmin(data)
        .then((result) => {
          // TODO: Log this result
          console.log(
            `${promote ? 'PROMOTE' : 'DEMOTE'}D ADMIN  TODO: Log this result`,
            result
          )
        })
        .catch((error) => {
          // Handle Errors here.
          console.log('🤡', error.message)
        })
    },
  },
}
</script>
