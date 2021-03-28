<style scoped>
.textEdit {
  margin-top: 0px !important;
  padding-top: 0px !important;
}
.textEditCol {
  padding-top: 10px !important;
  padding-bottom: 0px !important;
}
.noPadding {
  padding: 0px;
}
</style>
<template>
  <v-dialog :value="value" max-width="576px" @input="$emit('input', $event)">
    <div v-if="bountyIsBound">
      <v-card
        ><v-card-text>
          <v-container>
            <v-row>
              <v-col cols="1"> <v-icon>mdi-page-layout-header</v-icon></v-col>
              <v-col cols="11">
                <v-container v-if="editingTitle" class="noPadding">
                  <v-row>
                    <v-col class="textEditCol">
                      <v-textarea
                        v-model="editedTitle"
                        rows="1"
                        auto-grow
                        counter
                        class="text-h6 textEdit"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <v-row justify="start">
                    <v-col
                      ><v-btn small @click="cancelEditTitle()">cancel</v-btn>
                      <v-btn small @click="saveEditedTitle()">update</v-btn>
                    </v-col>
                  </v-row>
                </v-container>

                <v-container v-else class="noPadding" @click="editTitle()">
                  <v-row
                    ><v-col class="text-h6 noPadding">
                      {{ bounty.title }}
                    </v-col></v-row
                  >
                </v-container>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1"> <v-icon>mdi-identifier</v-icon></v-col>
              <v-col cols="11" class="text-caption">{{
                bounty.id
              }}</v-col></v-row
            >
            <v-row>
              <v-col cols="1"> <v-icon>mdi-text</v-icon></v-col>
              <v-col cols="11">
                <v-container v-if="editingDescription" class="noPadding">
                  <v-row>
                    <v-col class="textEditCol">
                      <v-textarea
                        v-model="editedDescription"
                        rows="3"
                        auto-grow
                        filled
                        hint="Add a more detailed description"
                        counter
                        class="textEdit"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <v-row justify="start">
                    <v-col
                      ><v-btn small @click="cancelEditDescription()"
                        >cancel</v-btn
                      >
                      <v-btn small @click="saveEditedDescription()"
                        >update</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-container>

                <v-container
                  v-else
                  class="noPadding"
                  @click="editDescription()"
                >
                  <v-row
                    ><v-col class="noPadding">
                      {{ bounty.description }}
                    </v-col></v-row
                  >
                </v-container>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1"> <v-icon>mdi-clipboard-check</v-icon></v-col>
              <v-col cols="11">
                <TaskList
                  :tasks="bounty.tasksSpecification"
                  tasklist-type="specification"
                  :bounty-id="bountyid"
                  :can-add-tasks="canAddTasksSpecification"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1"> <v-icon>mdi-clipboard-check</v-icon></v-col>
              <v-col cols="11">
                <TaskList
                  :tasks="bounty.tasksProduction"
                  tasklist-type="production"
                  :bounty-id="bountyid"
                  :can-add-tasks="canAddTasksProduction"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1"> <v-icon>mdi-clipboard-check</v-icon></v-col>
              <v-col cols="11">
                <TaskList
                  :tasks="bounty.tasksQA"
                  tasklist-type="qa"
                  :bounty-id="bountyid"
                  :can-add-tasks="canAddTasksQA"
                />
              </v-col>
            </v-row>
          </v-container> </v-card-text
      ></v-card>
    </div>
    <div v-else>
      <v-skeleton-loader
        type="card-avatar,card-heading: heading,  list-item@7, paragraph@3, list-item@5, article, actions"
        max-width="576px"
        height="90%"
      ></v-skeleton-loader>
    </div>
  </v-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import TaskList from '~/components/TaskList.vue'
export default {
  components: {
    TaskList,
  },
  props: {
    bountyid: { type: String, default: '' },
    value: { type: Boolean, default: false },
  },
  data() {
    return {
      dialog: false,
      bountyIsBound: false,
      editing: false,
      editingTitle: false,
      editedTitle: '',
      editingDescription: false,
      editedDescription: '',
    }
  },

  computed: {
    bounty() {
      if (this.bountyid.length) {
        return this.getEditingBounty()
      } else {
        return {}
      }
    },
    canEditTitle() {
      if (this.$store.state.user != null) {
        return this.$store.state.user.admin || this.$store.state.user.superadmin
      } else {
        return false
      }
    },
    canEditDescription() {
      if (this.$store.state.user != null) {
        return this.$store.state.user.admin || this.$store.state.user.superadmin
      } else {
        return false
      }
    },
    canAddTasksSpecification() {
      if (this.$store.state.user != null) {
        return this.$store.state.user.admin || this.$store.state.user.superadmin
      } else {
        return false
      }
    },
    canAddTasksProduction() {
      if (this.$store.state.user != null) {
        return this.$store.state.user.admin || this.$store.state.user.superadmin
      } else {
        return false
      }
    },
    canAddTasksQA() {
      if (this.$store.state.user != null) {
        return this.$store.state.user.admin || this.$store.state.user.superadmin
      } else {
        return false
      }
    },
  },
  watch: {
    value(val) {
      console.log('dialog changed')
      console.log('val', val)
      if (val) {
        console.log('opened')
        this.bindBountyDoc(this.bountyid).then(() => {
          console.log('bound to data')
          this.bountyIsBound = true
        })
      } else {
        console.log('closed')
        this.bountyIsBound = false
      }
    },
  },
  /*
  mounted() {
    console.log(
      `Bounty Card component mounted with bounty id ${this.bounty.id}:`
    )
    console.dir(this.bounty)
  },
*/
  /*
  mounted() {
    if (this.bountyid.length) {
      this.bindBountyDoc(this.bountyid).then(() => {
        console.log('bound to data')
      })
    } else {
      console.log('no bountyid passed as prop')
    }
  },
  */
  methods: {
    ...mapGetters(['getEditingBounty']),
    ...mapActions(['bindBountyDoc', 'updateBounty']),
    updateBountyItem(data) {
      return this.updateBounty({
        id: this.bounty.id,
        change: data,
      })
    },

    editTitle() {
      if (!this.canEditTitle) {
        return
      }
      this.editedTitle = this.bounty.title
      this.editingTitle = true
    },
    cancelEditTitle() {
      this.editingTitle = false
    },
    saveEditedTitle() {
      const update = {
        key: 'title',
        value: this.editedTitle,
        originalValue: this.bounty.title,
      }
      this.updateBountyItem(update).then(() => {
        this.editingTitle = false
        this.editedTitle = ''
      })
    },

    editDescription() {
      if (!this.canEditDescription) {
        return
      }
      this.editedDescription = this.bounty.description
      this.editingDescription = true
    },
    cancelEditDescription() {
      this.editingDescription = false
    },
    saveEditedDescription() {
      const update = {
        key: 'description',
        value: this.editedDescription,
        originalValue: this.bounty.description,
      }

      this.updateBountyItem(update).then(() => {
        this.editingDescription = false
        this.editedDescription = ''
      })
    },
  },
}
</script>
