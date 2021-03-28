<style scoped>
.noPadding {
  padding: 0px;
}
</style>

<template>
  <v-container class="noPadding">
    <v-row>
      <v-col class="noPadding">
        <div class="text-h6">{{ title }}</div>
      </v-col>
    </v-row>
    <v-row>
      <!--<v-col> {{ completeTasks }}/{{ totalTasks }} </v-col>-->
      <v-col class="noPadding">
        <v-progress-linear :value="progress" height="25">
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </v-col>
    </v-row>
    <v-row v-for="task in tasks" :key="task.id">
      <v-col class="noPadding">
        <v-card elevation="2" outlined>
          <Task :task-id="task.id" :bounty-id="bountyId" />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="canAddTasks" align="start">
      <v-col>
        <v-btn @click.stop="addNewTask()">Add Task</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from 'vuex'
import Task from '~/components/Task.vue'
export default {
  components: {
    Task,
  },
  props: {
    tasklistType: { type: String, default: '' },
    tasks: { type: Array, default: () => [] },
    bountyId: { type: String, default: '' },
    canAddTasks: { type: Boolean, default: false },
  },
  data() {
    return {}
  },
  computed: {
    title() {
      return this.titleCase(this.tasklistType) + ' Tasks'
    },

    totalTasks() {
      return this.tasks.length
    },

    completedTasks() {
      return this.tasks.filter((t) => t.complete).length
    },
    progress() {
      if (this.totalTasks > 0) {
        return (this.completedTasks / this.totalTasks) * 100
      } else {
        return 0
      }
    },
  },
  methods: {
    ...mapActions(['addTask']),

    titleCase(word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    },

    addNewTask() {
      const payload = {}
      payload.bountyId = this.bountyId
      payload.taskType = 'tasks' + this.titleCase(this.tasklistType)
      if (this.tasklistType.toUpperCase() === 'QA') {
        // TODO - annoying workaround - remove/ add an enum etc
        console.log(`Adding QA task - using workaround for field name `)
        payload.taskType = 'tasksQA'
      }

      this.addTask(payload).then((result) => {
        console.log(`ADD TASK RETURNED WITH RESULT: ${result}`)
      })
    },
  },
}
</script>
