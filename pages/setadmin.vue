// src/pages/register-admin
<template>
  <form @submit.prevent="onSubmit">
    <button type="submit" class="btn btn-primary">Register Admin</button>
  </form>
</template>
<script>
export default {
  name: 'RegisterAdmin',

  methods: {
    onSubmit() {
      const admin = {
        role: {
          admin: true,
        },
      }
      const setAdmin = this.$fire.functions.httpsCallable('setAdmin')
      const data = { uid: this.$store.state.user.uid, role: admin.role }
      console.log(`ADD ADMIN USER WITH DATA ${JSON.stringify(data)}`)
      setAdmin(data)
        .then((result) => {
          console.log(`ADDDED ADMIN`, result)
        })
        .catch((error) => {
          // Handle Errors here.
          console.log('🤡', error.message)
        })
    },
  },
}
</script>
