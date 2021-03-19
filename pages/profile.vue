<template>
  <div>
    <span class="headline">{{ this.$store.state.user.uid }}</span>
    <span class="headline">admin? {{ this.$store.state.user.admin }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: '',
    }
  },
}
</script>
