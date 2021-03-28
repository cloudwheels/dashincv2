<style scoped>
.completed {
  text-decoration: line-through;
}
.textEdit {
  margin-top: 0px !important;
  padding-top: 0px !important;
}
.textEditCol {
  padding-top: 10px !important;
}
.noPadding {
  padding: 0px;
}
.alignCenter {
  text-align: center;
}
</style>
<template>
  <div>
    <v-container class="noPadding">
      <v-row>
        <v-col cols="1"> <v-icon>mdi-identifier</v-icon></v-col>
        <v-col cols="11" class="text-caption"
          >{{ task.id }}
          <v-badge
            v-if="isPublished"
            offset-x="5"
            offset-y="-5"
            color="green"
          ></v-badge> </v-col
      ></v-row>

      <v-row align="start">
        <v-col cols="1">
          <v-simple-checkbox
            v-model="task.complete"
            @click.prevent.stop.capture="completeChecked"
          ></v-simple-checkbox>
        </v-col>
        <v-col v-if="editingDescription" cols="8" class="textEditCol">
          <v-textarea
            v-model="editedDescription"
            class="textEdit"
            rows="2"
            auto-grow
          ></v-textarea>
        </v-col>
        <v-col v-else cols="8"
          ><div
            :class="{ completed: task.complete }"
            @click="editDescription()"
          >
            {{ task.description }}
          </div></v-col
        >
        <v-col cols="3">
          <v-row>
            <v-spacer />
            <v-col class="noPadding alignCenter">
              <DueDatePicker
                :can-edit="canEditDue"
                :selected-date="task.due"
                @dateUpdated="saveEditedDueDate($event)"
              />
            </v-col>
            <v-spacer />
          </v-row>
          <v-row>
            <v-spacer />
            <v-col class="noPadding alignCenter">
              <MemberPicker
                :can-edit="canEditAssigned"
                :selected-member-id="task.assignedMemberId"
                @assigneeUpdated="saveEditedAssignee($event)"
              />
            </v-col>
            <v-spacer />
          </v-row>
          <v-row>
            <v-spacer />
            <v-col class="noPadding alignCenter">
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item v-for="(item, i) in menuItems" :key="i">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-spacer />
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="editingDescription">
        <v-col cols="1"></v-col>
        <v-col cols="11"
          ><v-btn small @click="cancelEditDescription()">cancel</v-btn>
          <v-btn small @click="saveEditedDescription()">update</v-btn></v-col
        >
      </v-row>
      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="11"
          ><RewardPicker
            :can-edit="canEditReward"
            :set-amount="rewardDashString"
            @amountUpdated="saveEditedRewardDash($event)"
          />
        </v-col>
      </v-row>
      <v-row v-if="editingDescription">
        <v-col cols="1"></v-col>
        <v-col cols="11">
          <v-combobox
            v-model="skillChips"
            :items="skills"
            chips
            clearable
            label="Required skills"
            multiple
            solo
          >
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                close
                small
                @click="select"
                @click:close="removeSkill(item)"
              >
                <strong>{{ item }}</strong>
              </v-chip>
            </template>
          </v-combobox>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="1"></v-col>
        <v-col cols="11">
          <template v-for="(item, index) in skillChips">
            <v-chip :key="index" small>
              <strong>{{ item }}</strong
              ><v-spacer></v-spacer>
            </v-chip>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
// import MemberList from '~/components/MemberList.vue'
import MemberPicker from '~/components/MemberPicker.vue'
import DueDatePicker from '~/components/DueDatePicker.vue'
import RewardPicker from '~/components/RewardPicker.vue'
export default {
  name: 'Task',
  components: {
    // MemberList,
    DueDatePicker,
    RewardPicker,
    MemberPicker,
  },
  props: {
    // task: { type: Object, default: () => {} },
    taskId: { type: String, default: '' },
    bountyId: { type: String, default: '' },
    /*
    id: String,
    description: String,
    */
  },
  data() {
    return {
      canEdit: true,
      editingDescription: false,
      editedDescription: '',
      skillChips: ['Platform'],
      skills: ['javascript', 'front-end', 'vue', 'react', 'database', 'golang'],
      menuItems: [{ title: 'View Id' }],
    }
  },

  computed: {
    allTasks() {
      return this.getTasks()
    },
    canEditDescription() {
      if ($store.state.user) {
        return this.$store.state.user.admin || this.$store.state.user.superadmin
      } else {
        return false
      }
    },
    canEditAssigned() {
      if ($store.state.user) {
        return this.$store.state.user.admin || this.$store.state.user.superadmin
      } else {
        return false
      }
    },
    canEditDue() {
      if ($store.state.user) {
        return this.$store.state.user.admin || this.$store.state.user.superadmin
      } else {
        return false
      }
    },
    canEditReward() {
      if ($store.state.user) {
        return this.$store.state.user.admin || this.$store.state.user.superadmin
      } else {
        return false
      }
    },
    isPublished() {
      console.log(`Published?:`)
      console.log(`task is not complete: ${!this.task.complete}`)
      console.log(
        `description has a length > 0: ${this.task.description.length > 0}`
      )
      console.log(`assignedMemberId : ${this.task.assignedMemberId}`)
      console.log(
        `assignedMemberId ===null: ${this.task.assignedMemberId === null}`
      )
      console.log(`due: ${this.task.due}`)
      console.log(`due ===null: ${this.task.due === null}`)
      return (
        !this.task.complete &&
        this.task.description.length > 0 &&
        this.task.assignedMemberId === null &&
        this.task.due === null
      )
    },
    task() {
      console.log(`All Tasks:`)
      console.dir(this.allTasks)
      console.log(`looking for the task with id ${this.taskId}`)
      const thisTask = this.allTasks.filter((t) => t.id === this.taskId)[0]
      console.log(`TASK is: ${thisTask}`)
      console.dir(thisTask)
      if (typeof thisTask !== 'undefined') {
        return thisTask
      } else {
        // TODO: this prevents and error when adding a new task, but seems to work as a workaround!!!
        // Remove asap
        console.log('returning an empty task')
        return {
          rewardDash: null,
          description: 'New Task',
          complete: false,
          due: null,
          assignedMemberId: null,
        }
      }
    },
    rewardDashString() {
      // parse in case of null
      // TODO : pass null to component if not set
      if (this.task.rewardDash === null) {
        return '0'
      } else {
        return this.task.rewardDash.toString()
      }
    },
  },

  created() {},

  mounted() {
    console.log(this.isPublished)
  },

  methods: {
    ...mapActions(['updateTask', 'bindTasks']),
    ...mapGetters(['getTasks']),
    editDescription() {
      if (!this.canEditDescription) {
        return
      }
      this.editedDescription = this.task.description
      this.editingDescription = true
    },
    completeChecked() {
      alert('complete Checked')
    },

    cancelEditDescription() {
      this.editingDescription = false
    },
    saveEditedDescription() {
      const update = {
        key: 'description',
        value: this.editedDescription,
        originalValue: this.task.description,
      }

      this.updateTaskItem(update).then(() => {
        this.editingDescription = false
        this.editedDescription = ''
      })
    },

    saveEditedDueDate(newDate) {
      const update = {
        key: 'due',
        value: newDate,
        originalValue: this.task.due,
      }

      this.updateTaskItem(update).then(() => {
        console.log('due date updated')
      })
    },

    saveEditedAssignee(newAssignee) {
      if (newAssignee != null) {
        newAssignee = newAssignee.id
      }
      const update = {
        key: 'assignedMemberId',
        value: newAssignee,
        originalValue: this.task.assignedMemberId,
      }

      this.updateTaskItem(update).then(() => {
        console.log('assigned member updated')
      })
    },

    saveEditedRewardDash(newAmount) {
      const update = {
        key: 'rewardDash',
        value: newAmount,
        originalValue: this.task.rewardDash,
      }

      this.updateTaskItem(update).then(() => {
        console.log('DASH reward amount updated')
      })
    },

    updateTaskItem(data) {
      // console.dir(newValue)
      // alert(`UPDATE DESCRIPTION of task ${key} from ${original} ${newValue}`)

      return this.updateTask({
        bountyId: this.bountyId,
        taskId: this.task.id,
        change: data,
      })
    },

    removeSkill(item) {
      this.skillChips.splice(this.skillChips.indexOf(item), 1)
      this.skillChips = [...this.skillChips]
    },
  },
}
</script>
