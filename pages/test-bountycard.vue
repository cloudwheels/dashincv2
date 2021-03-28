<template>
  <v-dialog v-model="dialog" max-width="576px">
    <BountyCard
      :bounty="{
        title: 'my title',
        description: 'my description',
        tasksProduction: [
          { id: 1, description: 'task description', rewardDash: 5 },
        ],
      }"
    />
  </v-dialog>
</template>

<script>
import BountyCard from '~/components/BountyCard.vue'
export default {
  components: {
    BountyCard,
  },
  data() {
    return {
      dialog: true,
    }
  },
}
</script>

<style></style>
