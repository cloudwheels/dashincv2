<template>
  <div>
    <div v-if="editedMemberId === null">
      <!--no assignee-->
      <v-icon @click.stop="openDialogSetAssigned()">mdi-account-plus</v-icon>
    </div>
    <div v-else>
      <v-avatar size="24" @click="openDialogSetAssigned()">
        <v-img :src="selectedMemberAvatarURL"></v-img>
      </v-avatar>
      <v-btn v-if="canEdit" outlined x-small fab @click.stop="remove()"
        ><v-icon>mdi-account-removed</v-icon></v-btn
      >
    </div>

    <v-dialog v-model="dialogSetAssigned" max-width="500px">
      <div height="70%">
        <v-toolbar flat color="primary">
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

              <v-list-item
                :key="item.username"
                @click.stop="selectMemberListItem(item)"
              >
                <v-list-item-avatar>
                  <v-img :src="item.avatarURL"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ item.username }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </div>
    </v-dialog>
    <template>
      <!--Confirmation dialog-->
      <v-dialog v-model="confirmDialog" max-width="350">
        <v-card>
          <v-card-title>Confirm Assignment</v-card-title>
          <v-card-text
            ><div>Do you want to assign this member to the task?</div>
            <v-list-item
              ><v-list-item-avatar>
                <v-img :src="selectedMemberAvatarURL"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{
                  selectedMember.username
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click.stop="save()"> OK </v-btn>
            <v-btn text @click.stop="cancel()"> Cancel </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'MemberPicker',
  props: {
    selectedMemberId: { type: String, default: '' },
    canEdit: { type: Boolean, default: false },
  },

  data() {
    return {
      search: '',
      dialogSetAssigned: false,
      editedMemberId: '',
      originalMemberId: '',
      selectedMemberIndex: -1,
      loading: true,
      confirmDialog: false,
    }
  },
  computed: {
    items() {
      return this.getMembers()
    },
    selectedMember() {
      if (this.selectedMemberIndex > -1) {
        return this.items[this.selectedMemberIndex]
      } else {
        return {}
      }
    },
    selectedMemberAvatarURL() {
      if (this.selectedMember !== {}) {
        return this.selectedMember.avatarURL
      } else {
        return ''
      }
    },
    keywords() {
      if (!this.search) return []

      const keywords = []

      for (const search of this.searching) {
        keywords.push(search.keyword)
      }

      return keywords
    },
    searching() {
      if (!this.search) return this.items

      const search = this.search.toLowerCase()

      return this.items.filter((item) => {
        const text = item.username.toLowerCase()

        return text.includes(search)
      })
    },
  },
  mounted() {
    this.editedMemberId = this.selectedMemberId
    this.selectedMemberIndex = this.findMemberIndex(this.editedMemberId)
    this.originalMemberId = this.editedMemberId
  },
  created() {
    this.bindProfiles().then(() => {
      console.log('member data loaded')
      this.loading = false
    })
  },
  methods: {
    ...mapGetters(['getMembers']),
    ...mapActions(['bindProfiles']),

    findMemberIndex(id) {
      console.log(`looking for member with id ${id} in member list`)
      console.dir(this.items)
      const item = this.items.filter((m) => {
        return m.id === id
      })[0]
      console.log(`found member item`)
      console.dir(item)
      const memberIndex = this.items.indexOf(item)
      console.log(`memberindex: ${memberIndex}`)
      return memberIndex
    },

    openDialogSetAssigned() {
      if (!this.canEdit) {
        return
      }
      this.dialogSetAssigned = true
    },
    closeDialogSetAssigned() {
      this.dialogSetAssigned = false
    },
    selectMemberListItem(item) {
      console.log('member seleceted')
      console.dir(item)
      this.confirmDialog = true
    },
    save() {
      this.$emit('assigneeUpdated', this.selectedMember)
      this.confirmDialog = false
      this.closeDialogSetAssigned()
    },
    remove() {
      this.editedMemberId = null
      this.$emit('assigneeUpdated', null)
    },
    cancel() {
      this.confirmDialog = false
    },
  },
}
</script>

<style></style>
