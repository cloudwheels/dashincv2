<template>
  <div>
    <v-card v-for="task in MyTasks" :key="task.id">
      <v-card-title>{{ task.description }}</v-card-title>
      <v-card-text>{{ task.due }} {{ task.rewardDash }}</v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'MyTasks',
  computed: {
    MyTasks() {
      return this.getMyTasks() // .filter((b) => b.worktype === 'project')  //is filter a mutation of state??
    },
  },
  created() {
    this.bindMyTasks().then(() => {
      console.log('My Tassk DATA LOADED')
      this.dataLoading = false
    })
  },
  methods: {
    ...mapGetters(['getMyTasks']),
    ...mapActions(['bindMyTasks']),
  },
}
</script>

<style></style>
