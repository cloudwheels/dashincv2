// src/pages/load-trello
<template>
  <div>
    <form @submit.prevent="onSubmit">
      <button type="submit" class="btn btn-primary">LOad Trello Data</button>
    </form>
    <form @submit.prevent="importUsers">
      <button type="submit" class="btn btn-primary">Import Users</button>
    </form>
  </div>
</template>
<script>
export default {
  name: 'LoadTrello',

  methods: {
    onSubmit() {
      const loadTrello = this.$fire.functions.httpsCallable('transfer')

      loadTrello()
        .then((result) => {
          console.log(`LOAD TRELLO DATA`, result)
        })
        .catch((error) => {
          // Handle Errors here.
          console.log('🤡', error.message)
        })
    },

    importUsers() {
      const users = this.$fire.functions.httpsCallable('importUsers')

      users()
        .then((result) => {
          console.log(`IMPORTED USERS`, result)
        })
        .catch((error) => {
          // Handle Errors here.
          console.log('🤡', error.message)
        })
    },
  },
}
</script>
