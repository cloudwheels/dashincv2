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
          superadmin: true,
        },
      }
      const setAdmin = this.$fire.functions.httpsCallable('setAdmin')
      const data = { uid: '5e413a386e35028d77fa7dfd', role: admin.role }
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
