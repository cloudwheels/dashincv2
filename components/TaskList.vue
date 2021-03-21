<template>
  <v-container>
    <v-row>
      <v-col>
        {{ title }}
      </v-col>
    </v-row>
    <v-row>
      <!--<v-col> {{ completedTasks }}/{{ totalTasks }} </v-col>-->
      <v-col>
        <v-progress-linear :value="progress" height="25">
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </v-col>
    </v-row>
    <v-row v-for="task in tasks" :key="task.id">
      <v-col>
        <Task :id="task.id" :description="task.description" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Task from '~/components/Task.vue'
export default {
  components: {
    Task,
  },
  data() {
    return {
      tasklistType: 'production',

      tasks: [
        {
          id: '123455',
          description: 'sample task description',
          completed: true,
        },
      ],
    }
  },
  computed: {
    title() {
      return (
        this.tasklistType.charAt(0).toUpperCase() +
        this.tasklistType.substr(1).toLowerCase() +
        ' Tasks'
      )
    },
    totalTasks() {
      return this.tasks.length
    },
    completedTasks() {
      return this.tasks.filter((t) => t.completed).length
    },
    progress() {
      return (this.totalTasks / this.completedTasks) * 100
    },
  },
}
</script>
