<template>
  <div>
    <span class="headline">{{ this.$store.state.user.uid }}</span>
    <span class="headline">admin? {{ this.$store.state.user.admin }}</span>

    <MyTasks />
  </div>
</template>

<script>
import MyTasks from '~/components/MyTasks.vue'
export default {
  components: {
    MyTasks,
  },
  data() {
    return {
      user: '',
    }
  },
}
</script>
