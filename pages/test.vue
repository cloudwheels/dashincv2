<template>
  <div>
    <Task />
    <v-spacer />
    <RewardPicker @amount="updateAmount($event)" />
    <div>amount: {{ amount }}</div>
    <v-spacer />
    <TaskList />
  </div>
</template>
<script>
import Task from '~/components/Task.vue'
import RewardPicker from '~/components/RewardPicker.vue'
import TaskList from '~/components/TaskList.vue'
export default {
  components: { Task, RewardPicker, TaskList },
  data() {
    return {
      amount: 0,
    }
  },
  methods: {
    updateAmount(amount) {
      return (this.amount = amount)
    },
  },
}
</script>
